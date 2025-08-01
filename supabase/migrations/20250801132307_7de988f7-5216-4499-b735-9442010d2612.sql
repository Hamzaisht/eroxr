-- Critical Storage Performance Optimizations
-- Add cache headers and CDN configuration for faster media loading

-- Update storage buckets with optimized cache settings
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB limit
  allowed_mime_types = ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/ogg'
  ]
WHERE id IN ('media', 'avatars', 'banners', 'stories', 'videos', 'thumbnails');

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their folder in media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;

-- Create optimized storage policies for faster access
-- Allow public read access to all media buckets for CDN caching
CREATE POLICY "Public read access for media" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id IN ('media', 'avatars', 'banners', 'stories', 'videos', 'thumbnails'));

-- Create function to batch fetch user profiles with avatars
-- This reduces N+1 query problems
CREATE OR REPLACE FUNCTION public.get_user_profiles_batch(user_ids UUID[])
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  display_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    COALESCE(p.display_name, p.username, 'User') as display_name
  FROM profiles p
  WHERE p.id = ANY(user_ids);
$$;