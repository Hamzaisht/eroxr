-- Fix infinite recursion in user_roles by completely removing RLS policies that reference the same table
-- and creating a more secure approach

-- Drop ALL existing policies on user_roles to eliminate recursion
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can delete roles" ON public.user_roles;

-- Temporarily disable RLS on user_roles to break the recursion cycle
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Create a simpler, non-recursive approach
-- Only allow role management through specific functions with SECURITY DEFINER
-- This avoids the recursion issue entirely

-- Re-enable RLS but with no policies - access only through secure functions
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a secure function to check if user has admin role without recursion
CREATE OR REPLACE FUNCTION public.check_user_has_role(check_user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
    -- This function bypasses RLS entirely due to SECURITY DEFINER
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = check_user_id 
        AND role::text = required_role
    );
$$;

-- Update the existing functions to use the new approach
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid, min_role text DEFAULT 'admin'::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT public.check_user_has_role(user_id, 'super_admin') 
           OR (min_role = 'admin' AND public.check_user_has_role(user_id, 'admin'));
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT public.check_user_has_role(user_id, 'super_admin');
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_user_has_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;