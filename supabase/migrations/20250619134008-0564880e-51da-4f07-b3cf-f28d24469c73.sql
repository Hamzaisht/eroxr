
-- CRITICAL: Remove all legacy profile update functions that cause RLS recursion
-- This will eliminate the stack depth error by removing problematic code paths

-- Drop the legacy safe_profile_update function
DROP FUNCTION IF EXISTS public.safe_profile_update(uuid, text, text, text, text, text, text[], boolean, text);

-- Drop the legacy studio_update_profile function  
DROP FUNCTION IF EXISTS public.studio_update_profile(text, text, text, text, text, text[]);

-- Drop the legacy update_profile_bypass_rls function
DROP FUNCTION IF EXISTS public.update_profile_bypass_rls(uuid, text, text, text, text, text, text[], boolean, boolean, timestamp with time zone);

-- Drop the legacy get_profile_safe function
DROP FUNCTION IF EXISTS public.get_profile_safe(uuid);

-- Drop the legacy check_profile_permissions function
DROP FUNCTION IF EXISTS public.check_profile_permissions(uuid, uuid, text);

-- The ONLY profile functions that should remain are:
-- - rls_bypass_profile_update (the new secure function)
-- - rls_bypass_profile_fetch (the new secure function) 
-- - handle_new_user (for user creation)
-- All other profile-related functions have been removed to prevent RLS recursion
