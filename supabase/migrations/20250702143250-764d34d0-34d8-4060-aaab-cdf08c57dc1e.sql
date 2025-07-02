-- Fix infinite recursion in RLS policies by removing problematic policies
-- and creating proper security definer functions

-- First, let's remove the problematic RLS policies that might cause recursion
DROP POLICY IF EXISTS "Users can insert their own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;

-- Drop the optimized policies that use current_setting which can cause issues
DROP POLICY IF EXISTS "post_likes_insert_optimized" ON post_likes;
DROP POLICY IF EXISTS "post_likes_delete_optimized" ON post_likes;
DROP POLICY IF EXISTS "comments_insert_optimized" ON comments;
DROP POLICY IF EXISTS "comments_delete_optimized" ON comments;
DROP POLICY IF EXISTS "comments_update_optimized" ON comments;

-- Create simple, safe RLS policies using auth.uid() directly
CREATE POLICY "post_likes_insert_safe" ON post_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete_safe" ON post_likes  
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "comments_insert_safe" ON comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_safe" ON comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_safe" ON comments
FOR DELETE USING (auth.uid() = user_id);

-- Ensure posts can be viewed by everyone for public posts
CREATE POLICY "posts_select_safe" ON posts
FOR SELECT USING (visibility = 'public' OR creator_id = auth.uid());

-- Allow post creators to manage their own posts
CREATE POLICY "posts_insert_safe" ON posts
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "posts_update_safe" ON posts
FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "posts_delete_safe" ON posts
FOR DELETE USING (auth.uid() = creator_id);