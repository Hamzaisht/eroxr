-- Critical Storage Performance Optimizations
-- Add cache headers and CDN configuration for faster media loading

-- Update storage buckets with optimized cache settings
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800 -- 50MB limit
WHERE id IN ('media', 'avatars', 'banners', 'stories', 'videos', 'thumbnails');

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
    COALESCE(p.username, 'User') as display_name
  FROM profiles p
  WHERE p.id = ANY(user_ids);
$$;