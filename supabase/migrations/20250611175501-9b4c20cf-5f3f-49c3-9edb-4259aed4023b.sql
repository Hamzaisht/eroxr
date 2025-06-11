
-- Fix stack depth limit exceeded error by cleaning up conflicting RLS policies and triggers

-- Step 1: Drop all conflicting SELECT policies on profiles table
DROP POLICY IF EXISTS "All profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Allow public profile viewing" ON profiles; 
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;

-- Step 2: Create a single, clean SELECT policy for profiles
CREATE POLICY "Public profile viewing" ON profiles
  FOR SELECT USING (true);

-- Step 3: Fix the handle_new_user function to prevent recursion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Only insert if profile doesn't already exist to prevent conflicts
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 4: Clean up any duplicate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 5: Recreate the trigger with proper naming
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Add missing RLS policies for media uploads if they don't exist
DO $$
BEGIN
  -- Check if media_assets policies exist, create if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'media_assets' AND policyname = 'Users can manage their own media'
  ) THEN
    CREATE POLICY "Users can manage their own media" ON media_assets
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  -- Ensure profiles has proper update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Step 7: Refresh RLS to ensure clean state
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE media_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
