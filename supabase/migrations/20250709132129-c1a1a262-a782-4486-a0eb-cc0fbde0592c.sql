-- Fix foreign key constraints to support both posts and videos tables

-- First, drop the existing foreign key constraints
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_post_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;
ALTER TABLE post_saves DROP CONSTRAINT IF EXISTS post_saves_post_id_fkey;

-- Add a more flexible approach - allow post_id to reference either posts or videos
-- We'll use a check constraint and triggers to ensure referential integrity

-- For comments table
ALTER TABLE comments ADD CONSTRAINT comments_content_exists_check 
CHECK (
  EXISTS (SELECT 1 FROM posts WHERE id = post_id) OR 
  EXISTS (SELECT 1 FROM videos WHERE id = post_id)
);

-- For post_likes table  
ALTER TABLE post_likes ADD CONSTRAINT post_likes_content_exists_check 
CHECK (
  EXISTS (SELECT 1 FROM posts WHERE id = post_id) OR 
  EXISTS (SELECT 1 FROM videos WHERE id = post_id)
);

-- For post_saves table
ALTER TABLE post_saves ADD CONSTRAINT post_saves_content_exists_check 
CHECK (
  EXISTS (SELECT 1 FROM posts WHERE id = post_id) OR 
  EXISTS (SELECT 1 FROM videos WHERE id = post_id)
);

-- Create a function to validate content existence
CREATE OR REPLACE FUNCTION public.validate_content_reference(content_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM posts WHERE id = content_id) OR 
         EXISTS (SELECT 1 FROM videos WHERE id = content_id);
END;
$$ LANGUAGE plpgsql STABLE;