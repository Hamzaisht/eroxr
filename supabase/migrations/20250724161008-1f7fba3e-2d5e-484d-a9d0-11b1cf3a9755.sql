-- Fix infinite recursion in user_roles RLS policies and remaining security issues

-- First, drop existing problematic RLS policies on user_roles that cause recursion
DROP POLICY IF EXISTS "Users can view admin roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;

-- Create security definer functions to safely check roles without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid, min_role text DEFAULT 'admin'::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = is_admin_user.user_id 
        AND user_roles.role::text IN ('super_admin', 'admin')
        AND (min_role = 'admin' OR user_roles.role::text = 'super_admin')
    );
$function$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = is_super_admin.user_id 
        AND role = 'super_admin'
    );
$function$;

-- Create safe RLS policies for user_roles using security definer functions
CREATE POLICY "Super admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur2 
        WHERE ur2.user_id = auth.uid() 
        AND ur2.role = 'super_admin'
    )
);

CREATE POLICY "Super admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur2 
        WHERE ur2.user_id = auth.uid() 
        AND ur2.role = 'super_admin'
    )
);

CREATE POLICY "Super admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur2 
        WHERE ur2.user_id = auth.uid() 
        AND ur2.role = 'super_admin'
    )
);

CREATE POLICY "Super admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur2 
        WHERE ur2.user_id = auth.uid() 
        AND ur2.role = 'super_admin'
    )
);

-- Update any functions that might have search_path issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 'user'::text; -- Default role, can be extended later with actual role system
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
    SELECT role::text FROM user_roles WHERE user_roles.user_id = get_user_role.user_id LIMIT 1;
$function$;