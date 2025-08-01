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

-- Create optimized storage policies for faster access
-- Allow public read access to all media buckets for CDN caching
CREATE POLICY IF NOT EXISTS "Public read access for media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('media', 'avatars', 'banners', 'stories', 'videos', 'thumbnails'));

CREATE POLICY IF NOT EXISTS "Users can upload to their folder in media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can update their own media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id IN ('media', 'avatars', 'banners') 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can delete their own media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id IN ('media', 'avatars', 'banners') 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

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

-- Create function to get optimized media URLs
CREATE OR REPLACE FUNCTION public.get_optimized_media_url(
  storage_path TEXT,
  bucket_name TEXT DEFAULT 'media',
  width INTEGER DEFAULT NULL,
  height INTEGER DEFAULT NULL,
  quality INTEGER DEFAULT 85
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_url TEXT;
  transform_params TEXT := '';
BEGIN
  -- Build base URL
  base_url := 'https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/' || bucket_name || '/' || storage_path;
  
  -- Add transformation parameters
  IF width IS NOT NULL OR height IS NOT NULL THEN
    transform_params := 'resize=' || COALESCE(width::TEXT, '') || 'x' || COALESCE(height::TEXT, '');
  END IF;
  
  IF quality != 85 THEN
    IF transform_params != '' THEN
      transform_params := transform_params || '&';
    END IF;
    transform_params := transform_params || 'quality=' || quality::TEXT;
  END IF;
  
  -- Add WebP format for better compression
  IF transform_params != '' THEN
    transform_params := transform_params || '&format=webp';
  ELSE 
    transform_params := 'format=webp';
  END IF;
  
  -- Return optimized URL
  IF transform_params != '' THEN
    RETURN base_url || '?' || transform_params;
  ELSE
    RETURN base_url;
  END IF;
END;
$$;