
-- Drop all existing RLS policies that might be causing recursion
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles; 
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_write" ON profiles;

-- Create simple, non-recursive RLS policies
CREATE POLICY "profiles_public_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_authenticated_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_owner_delete" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
