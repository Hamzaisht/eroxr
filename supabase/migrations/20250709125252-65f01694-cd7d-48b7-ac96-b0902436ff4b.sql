-- Fix RLS policies for post_likes and post_saves to work with videos table

-- First, let's ensure post_likes works with videos table
DROP POLICY IF EXISTS "post_likes_insert_clean" ON post_likes;
CREATE POLICY "post_likes_insert_clean" ON post_likes
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_likes.post_id) OR
    EXISTS (SELECT 1 FROM videos WHERE videos.id = post_likes.post_id)
  )
);

DROP POLICY IF EXISTS "post_likes_delete_clean" ON post_likes;
CREATE POLICY "post_likes_delete_clean" ON post_likes
FOR DELETE 
USING (
  auth.uid() = user_id AND (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_likes.post_id) OR
    EXISTS (SELECT 1 FROM videos WHERE videos.id = post_likes.post_id)
  )
);

-- Fix post_saves policies to work with videos table
DROP POLICY IF EXISTS "post_saves_insert" ON post_saves;
DROP POLICY IF EXISTS "post_saves_insert_optimized" ON post_saves;
CREATE POLICY "post_saves_insert_clean" ON post_saves
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_saves.post_id) OR
    EXISTS (SELECT 1 FROM videos WHERE videos.id = post_saves.post_id)
  )
);

DROP POLICY IF EXISTS "post_saves_delete" ON post_saves;
DROP POLICY IF EXISTS "post_saves_delete_optimized" ON post_saves;
CREATE POLICY "post_saves_delete_clean" ON post_saves
FOR DELETE 
USING (
  auth.uid() = user_id AND (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_saves.post_id) OR
    EXISTS (SELECT 1 FROM videos WHERE videos.id = post_saves.post_id)
  )
);

-- Ensure comments work with videos table
DROP POLICY IF EXISTS "comments_insert_clean" ON comments;
CREATE POLICY "comments_insert_clean" ON comments
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id) OR
    EXISTS (SELECT 1 FROM videos WHERE videos.id = comments.post_id)
  )
);