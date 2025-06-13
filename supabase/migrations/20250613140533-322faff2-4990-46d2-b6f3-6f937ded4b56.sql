
-- Drop the old RPC function definition to resolve ambiguity
DROP FUNCTION IF EXISTS public.update_profile_bypass_rls(uuid, text, text, text, text, text, text[], boolean);

-- Ensure we only have the enhanced version with all parameters
-- (The enhanced version should already exist from the previous migration)
