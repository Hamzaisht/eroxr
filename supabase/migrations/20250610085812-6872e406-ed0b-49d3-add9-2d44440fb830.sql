
-- Phase 1: Database Queries & Media Relationships

-- Step 1: Add proper foreign key constraint between profiles and posts
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_creator_id 
FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 2: Add post_id column to media_assets for direct linking
ALTER TABLE media_assets 
ADD COLUMN post_id UUID REFERENCES posts(id) ON DELETE CASCADE;

-- Step 3: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_media_assets_post_id ON media_assets(post_id);
CREATE INDEX IF NOT EXISTS idx_posts_creator_id ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_metadata_post_id ON media_assets USING gin((metadata->'post_id'));

-- Step 4: Update orphaned media assets to link to posts based on metadata
UPDATE media_assets 
SET post_id = (metadata->>'post_id')::uuid
WHERE metadata->>'post_id' IS NOT NULL 
  AND metadata->>'post_id' != 'null'
  AND post_id IS NULL
  AND EXISTS (SELECT 1 FROM posts WHERE id = (metadata->>'post_id')::uuid);

-- Step 5: Enable realtime for proper subscriptions
ALTER TABLE media_assets REPLICA IDENTITY FULL;
ALTER TABLE posts REPLICA IDENTITY FULL;

-- Add tables to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'media_assets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE media_assets;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE posts;
  END IF;
END $$;
