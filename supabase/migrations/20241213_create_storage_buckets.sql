
-- Create storage buckets for EROXR profile system
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('studio-avatars', 'studio-avatars', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('studio-banners', 'studio-banners', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']);

-- Create storage policies for avatars
CREATE POLICY "Avatar files are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'studio-avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'studio-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'studio-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'studio-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policies for banners
CREATE POLICY "Banner files are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'studio-banners');

CREATE POLICY "Users can upload their own banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'studio-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own banners" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'studio-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own banners" ON storage.objects
FOR DELETE USING (
  bucket_id = 'studio-banners' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create or update the studio_update_profile function
CREATE OR REPLACE FUNCTION studio_update_profile(
  p_username text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_banner_url text DEFAULT NULL,
  p_interests text[] DEFAULT NULL
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
    updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;
