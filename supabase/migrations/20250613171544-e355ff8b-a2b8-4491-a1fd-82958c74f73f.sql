
-- Step 1: Drop ALL existing RLS policies on profiles table to start fresh
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles; 
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_write" ON profiles;
DROP POLICY IF EXISTS "profiles_public_select" ON profiles;
DROP POLICY IF EXISTS "profiles_authenticated_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_update" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_delete" ON profiles;

-- Step 2: Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 10485760, ARRAY['image/*']),
  ('banners', 'banners', true, 104857600, ARRAY['image/*', 'video/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Step 3: Create simple, non-recursive RLS policies for profiles
CREATE POLICY "profiles_public_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_user_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_user_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_user_delete" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Step 4: Create storage policies for avatars bucket
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_delete" ON storage.objects;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_user_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_user_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Step 5: Create storage policies for banners bucket
DROP POLICY IF EXISTS "banners_public_read" ON storage.objects;
DROP POLICY IF EXISTS "banners_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "banners_user_update" ON storage.objects;
DROP POLICY IF EXISTS "banners_user_delete" ON storage.objects;

CREATE POLICY "banners_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "banners_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "banners_user_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "banners_user_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Step 6: Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
