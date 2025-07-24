-- CRITICAL SECURITY FIXES - Phase 1 & 2 (Fixed)
-- Fix 1: Remove dangerous admin insertion policy and implement secure role assignment

-- Drop the dangerous policy that allows privilege escalation
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_roles;

-- Create secure admin role assignment policy - only existing admins can assign roles
CREATE POLICY "Only existing admins can assign roles" 
ON user_roles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Fix 2: Secure the assign_super_admin function
DROP FUNCTION IF EXISTS public.assign_super_admin(uuid);

CREATE OR REPLACE FUNCTION public.assign_super_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only existing super admins can assign super admin role
    IF NOT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Only super admins can assign super admin role';
    END IF;
    
    -- Log the assignment attempt
    INSERT INTO admin_action_logs (admin_id, target_id, action, action_type, target_type, details)
    VALUES (
        auth.uid(),
        target_user_id,
        'assign_super_admin',
        'role_assignment',
        'user',
        jsonb_build_object(
            'role_assigned', 'super_admin',
            'timestamp', NOW()
        )
    );
    
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$$;

-- Fix 3: Add proper search_path to all SECURITY DEFINER functions
ALTER FUNCTION public.get_current_user_role() SET search_path TO 'public';
ALTER FUNCTION public.get_user_role(uuid) SET search_path TO 'public';
ALTER FUNCTION public.is_super_admin(uuid) SET search_path TO 'public';
ALTER FUNCTION public.is_admin_user(uuid, text) SET search_path TO 'public';
ALTER FUNCTION public.check_username_available(text) SET search_path TO 'public';
ALTER FUNCTION public.can_change_username(uuid) SET search_path TO 'public';
ALTER FUNCTION public.can_change_dob(uuid) SET search_path TO 'public';
ALTER FUNCTION public.is_age_valid(date) SET search_path TO 'public';
ALTER FUNCTION public.is_verified_creator(uuid) SET search_path TO 'public';

-- Fix 4: Clean up duplicate policies

-- Clean up duplicate policies on media_assets
DROP POLICY IF EXISTS "media_assets_delete_policy" ON media_assets;
DROP POLICY IF EXISTS "media_assets_insert_policy" ON media_assets;
DROP POLICY IF EXISTS "media_assets_select_policy" ON media_assets;
DROP POLICY IF EXISTS "media_assets_update_policy" ON media_assets;
DROP POLICY IF EXISTS "Users can delete own media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can insert own media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can update own media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can view own media assets" ON media_assets;

-- Clean up duplicate policies on live_streams
DROP POLICY IF EXISTS "live_streams_delete" ON live_streams;
DROP POLICY IF EXISTS "live_streams_insert" ON live_streams;
DROP POLICY IF EXISTS "live_streams_select" ON live_streams;
DROP POLICY IF EXISTS "live_streams_update" ON live_streams;
DROP POLICY IF EXISTS "Anyone can view public live streams" ON live_streams;
DROP POLICY IF EXISTS "Creators can manage their own streams" ON live_streams;
DROP POLICY IF EXISTS "Users can insert their own streams" ON live_streams;
DROP POLICY IF EXISTS "Users can select live streams" ON live_streams;

-- Add missing RLS policies for communities table (skip existing ones)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Anyone can view public communities') THEN
        EXECUTE 'CREATE POLICY "Anyone can view public communities" ON communities FOR SELECT USING (NOT is_private OR created_by = auth.uid())';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Authenticated users can create communities') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can create communities" ON communities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid())';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Community creators can update their communities') THEN
        EXECUTE 'CREATE POLICY "Community creators can update their communities" ON communities FOR UPDATE USING (created_by = auth.uid())';
    END IF;
END$$;

-- Add missing RLS policies for community_members table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Community members can view membership') THEN
        EXECUTE 'CREATE POLICY "Community members can view membership" ON community_members FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM communities WHERE id = community_id AND created_by = auth.uid()))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Users can join communities') THEN
        EXECUTE 'CREATE POLICY "Users can join communities" ON community_members FOR INSERT WITH CHECK (user_id = auth.uid())';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Users can leave communities') THEN
        EXECUTE 'CREATE POLICY "Users can leave communities" ON community_members FOR DELETE USING (user_id = auth.uid())';
    END IF;
END$$;

-- Add missing RLS policies for content_analytics table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_analytics' AND policyname = 'Users can view their own content analytics') THEN
        EXECUTE 'CREATE POLICY "Users can view their own content analytics" ON content_analytics FOR SELECT USING (user_id = auth.uid())';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_analytics' AND policyname = 'System can insert analytics data') THEN
        EXECUTE 'CREATE POLICY "System can insert analytics data" ON content_analytics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    END IF;
END$$;

-- Add missing RLS policies for content_recommendations table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_recommendations' AND policyname = 'Users can view their own recommendations') THEN
        EXECUTE 'CREATE POLICY "Users can view their own recommendations" ON content_recommendations FOR SELECT USING (user_id = auth.uid())';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_recommendations' AND policyname = 'System can create recommendations') THEN
        EXECUTE 'CREATE POLICY "System can create recommendations" ON content_recommendations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    END IF;
END$$;

-- Fix 5: Create audit function for role changes
CREATE OR REPLACE FUNCTION audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO admin_action_logs (admin_id, target_id, action, action_type, target_type, details)
        VALUES (
            auth.uid(),
            NEW.user_id,
            'role_assigned',
            'role_management',
            'user',
            jsonb_build_object(
                'role', NEW.role,
                'operation', 'INSERT'
            )
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO admin_action_logs (admin_id, target_id, action, action_type, target_type, details)
        VALUES (
            auth.uid(),
            OLD.user_id,
            'role_removed',
            'role_management', 
            'user',
            jsonb_build_object(
                'role', OLD.role,
                'operation', 'DELETE'
            )
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Add audit trigger to user_roles
DROP TRIGGER IF EXISTS audit_user_roles_trigger ON user_roles;
CREATE TRIGGER audit_user_roles_trigger
    AFTER INSERT OR DELETE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION audit_role_changes();