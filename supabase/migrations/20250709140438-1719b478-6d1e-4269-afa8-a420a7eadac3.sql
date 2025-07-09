-- Remove any remaining foreign key constraints on trending_content table
-- that might be causing the insert/update violations

ALTER TABLE trending_content DROP CONSTRAINT IF EXISTS trending_content_post_id_fkey;

-- Also check for any other constraints that might be causing issues
ALTER TABLE trending_content DROP CONSTRAINT IF EXISTS fk_trending_content_post_id;