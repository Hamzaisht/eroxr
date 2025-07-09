-- Simply drop the problematic foreign key constraints
-- We'll handle referential integrity in the application layer

ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_post_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey; 
ALTER TABLE post_saves DROP CONSTRAINT IF EXISTS post_saves_post_id_fkey;

-- Remove any check constraints we may have tried to add
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_content_exists_check;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_content_exists_check;
ALTER TABLE post_saves DROP CONSTRAINT IF EXISTS post_saves_content_exists_check;