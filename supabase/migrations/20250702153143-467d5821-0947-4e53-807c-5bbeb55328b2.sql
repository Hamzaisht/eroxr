-- Temporarily disable the problematic trigger that causes recursion
DROP TRIGGER IF EXISTS unpause_accounts_trigger ON public.profiles;

-- The trigger was causing infinite recursion because it updates the profiles table
-- which triggers itself again. We'll implement a better solution that doesn't cause recursion.