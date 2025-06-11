
-- First, let's ensure we have proper indexes and fix the media_assets relationship
-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_assets_post_id ON media_assets(post_id);
CREATE INDEX IF NOT EXISTS idx_post_saves_user_id ON post_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_user_id ON creator_subscriptions(user_id);

-- Create a view for user bookmarks that includes all saved content
CREATE OR REPLACE VIEW user_bookmarks AS
SELECT 
  ps.user_id,
  p.*,
  pr.username as creator_username,
  pr.avatar_url as creator_avatar_url,
  'bookmark' as source_type,
  ps.created_at as saved_at
FROM post_saves ps
JOIN posts p ON ps.post_id = p.id
JOIN profiles pr ON p.creator_id = pr.id
WHERE p.visibility = 'public';

-- Create RLS policy for user bookmarks view
ALTER VIEW user_bookmarks SET (security_invoker = true);

-- Add a function to get user's comprehensive bookmark data
CREATE OR REPLACE FUNCTION get_user_bookmarks(p_user_id uuid)
RETURNS TABLE (
  bookmark_type text,
  post_id uuid,
  content text,
  creator_id uuid,
  creator_username text,
  creator_avatar_url text,
  created_at timestamptz,
  saved_at timestamptz,
  media_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'saved_post'::text as bookmark_type,
    p.id as post_id,
    p.content,
    p.creator_id,
    pr.username as creator_username,
    pr.avatar_url as creator_avatar_url,
    p.created_at,
    ps.created_at as saved_at,
    COALESCE(ma.media_count, 0) as media_count
  FROM post_saves ps
  JOIN posts p ON ps.post_id = p.id
  JOIN profiles pr ON p.creator_id = pr.id
  LEFT JOIN (
    SELECT post_id, COUNT(*) as media_count
    FROM media_assets
    GROUP BY post_id
  ) ma ON p.id = ma.post_id
  WHERE ps.user_id = p_user_id
    AND p.visibility = 'public'
  ORDER BY ps.created_at DESC;
END;
$$;
