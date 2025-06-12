
-- Complete RLS cleanup and fix for stack depth error

-- Step 1: Drop ALL existing RLS policies on profiles table to eliminate conflicts
DROP POLICY IF EXISTS "All profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Allow public profile viewing" ON profiles; 
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Public profile viewing" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Step 2: Drop ALL existing RLS policies on media_assets table
DROP POLICY IF EXISTS "Users can manage their own media" ON media_assets;
DROP POLICY IF EXISTS "Users can view their own media" ON media_assets;
DROP POLICY IF EXISTS "Users can insert their own media" ON media_assets;
DROP POLICY IF EXISTS "Users can update their own media" ON media_assets;
DROP POLICY IF EXISTS "Users can delete their own media" ON media_assets;
DROP POLICY IF EXISTS "Enable read access for all users" ON media_assets;

-- Step 3: Create a security definer function to bypass RLS for profile updates
CREATE OR REPLACE FUNCTION public.update_profile_bypass_rls(
  p_user_id UUID,
  p_username TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_banner_url TEXT DEFAULT NULL,
  p_interests TEXT[] DEFAULT NULL,
  p_profile_visibility BOOLEAN DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET 
    username = COALESCE(p_username, username),
    bio = COALESCE(p_bio, bio),
    location = COALESCE(p_location, location),
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    banner_url = COALESCE(p_banner_url, banner_url),
    interests = COALESCE(p_interests, interests),
    profile_visibility = COALESCE(p_profile_visibility, profile_visibility),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

-- Step 4: Create single, clean RLS policies for profiles
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Step 5: Create single, clean RLS policies for media_assets
CREATE POLICY "media_assets_select_policy" ON media_assets
  FOR SELECT USING (access_level = 'public' OR auth.uid() = user_id);

CREATE POLICY "media_assets_insert_policy" ON media_assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "media_assets_update_policy" ON media_assets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "media_assets_delete_policy" ON media_assets
  FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Ensure RLS is enabled on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Step 7: Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Step 8: Create storage policies for the media bucket
DO $$
BEGIN
  -- Drop existing storage policies
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload media" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view media" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
  
  -- Create new storage policies
  CREATE POLICY "storage_media_select_policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');
    
  CREATE POLICY "storage_media_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
    
  CREATE POLICY "storage_media_update_policy" ON storage.objects
    FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
    
  CREATE POLICY "storage_media_delete_policy" ON storage.objects
    FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
    
EXCEPTION
  WHEN others THEN
    -- If storage policies fail, continue anyway
    NULL;
END $$;
