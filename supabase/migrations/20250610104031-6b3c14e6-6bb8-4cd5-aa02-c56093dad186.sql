
-- Phase 1: Immediate Database Repair
-- Link orphaned media assets to posts based on user_id and timestamp proximity

WITH orphaned_media AS (
  SELECT 
    ma.id as media_id,
    ma.user_id,
    ma.created_at as media_created_at,
    ma.metadata
  FROM media_assets ma
  WHERE ma.post_id IS NULL
    AND ma.user_id IS NOT NULL
    AND ma.created_at > NOW() - INTERVAL '7 days' -- Focus on recent orphaned media
),
candidate_posts AS (
  SELECT 
    p.id as post_id,
    p.creator_id,
    p.created_at as post_created_at,
    om.media_id,
    om.media_created_at,
    -- Calculate time difference in minutes
    ABS(EXTRACT(EPOCH FROM (p.created_at - om.media_created_at)) / 60) as time_diff_minutes
  FROM posts p
  JOIN orphaned_media om ON p.creator_id = om.user_id
  WHERE p.created_at > NOW() - INTERVAL '7 days'
    AND ABS(EXTRACT(EPOCH FROM (p.created_at - om.media_created_at)) / 60) <= 30 -- Within 30 minutes
),
best_matches AS (
  SELECT 
    media_id,
    post_id,
    ROW_NUMBER() OVER (PARTITION BY media_id ORDER BY time_diff_minutes ASC) as rn
  FROM candidate_posts
)
UPDATE media_assets 
SET post_id = bm.post_id
FROM best_matches bm
WHERE media_assets.id = bm.media_id 
  AND bm.rn = 1;

-- Verify the repair worked
SELECT 
  'Linked media assets' as status,
  COUNT(*) as count
FROM media_assets 
WHERE post_id IS NOT NULL 
  AND updated_at > NOW() - INTERVAL '5 minutes';
