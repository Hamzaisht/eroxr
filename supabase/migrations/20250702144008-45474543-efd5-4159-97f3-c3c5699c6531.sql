-- Comprehensive fix for stack depth limit by cleaning up ALL problematic RLS policies and triggers
-- This will remove ALL duplicate and potentially recursive policies

-- Drop ALL existing RLS policies on problematic tables to start fresh
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
DROP POLICY IF EXISTS "Users can create likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can see all post likes" ON post_likes;
DROP POLICY IF EXISTS "post_likes_delete" ON post_likes;
DROP POLICY IF EXISTS "post_likes_delete_safe" ON post_likes;
DROP POLICY IF EXISTS "post_likes_insert" ON post_likes;
DROP POLICY IF EXISTS "post_likes_insert_safe" ON post_likes;
DROP POLICY IF EXISTS "post_likes_select" ON post_likes;
DROP POLICY IF EXISTS "post_likes_select_optimized" ON post_likes;

-- Drop ALL existing comment policies
DROP POLICY IF EXISTS "Users can see all comments" ON comments;
DROP POLICY IF EXISTS "comments_delete" ON comments;
DROP POLICY IF EXISTS "comments_delete_safe" ON comments;
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_insert_safe" ON comments;
DROP POLICY IF EXISTS "comments_select" ON comments;
DROP POLICY IF EXISTS "comments_select_optimized" ON comments;
DROP POLICY IF EXISTS "comments_update" ON comments;
DROP POLICY IF EXISTS "comments_update_safe" ON comments;

-- Drop ALL existing post policies
DROP POLICY IF EXISTS "posts_select_safe" ON posts;
DROP POLICY IF EXISTS "posts_insert_safe" ON posts;
DROP POLICY IF EXISTS "posts_update_safe" ON posts;
DROP POLICY IF EXISTS "posts_delete_safe" ON posts;
DROP POLICY IF EXISTS "posts_select" ON posts;
DROP POLICY IF EXISTS "posts_insert" ON posts;
DROP POLICY IF EXISTS "posts_update" ON posts;
DROP POLICY IF EXISTS "posts_delete" ON posts;

-- Drop problematic triggers that might cause recursion
DROP TRIGGER IF EXISTS handle_post_like_trigger ON post_likes;
DROP TRIGGER IF EXISTS handle_post_comment_trigger ON comments;
DROP TRIGGER IF EXISTS handle_post_save_trigger ON post_saves;
DROP TRIGGER IF EXISTS update_post_engagement_score_trigger ON posts;
DROP TRIGGER IF EXISTS update_post_comment_count_trigger ON comments;

-- Now create clean, simple RLS policies without any recursive references
CREATE POLICY "post_likes_select_clean" ON post_likes
FOR SELECT USING (true);

CREATE POLICY "post_likes_insert_clean" ON post_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete_clean" ON post_likes
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "comments_select_clean" ON comments
FOR SELECT USING (true);

CREATE POLICY "comments_insert_clean" ON comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_clean" ON comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_clean" ON comments
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "posts_select_clean" ON posts
FOR SELECT USING (visibility = 'public' OR creator_id = auth.uid());

CREATE POLICY "posts_insert_clean" ON posts
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "posts_update_clean" ON posts
FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "posts_delete_clean" ON posts
FOR DELETE USING (auth.uid() = creator_id);