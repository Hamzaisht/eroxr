
-- Fix RLS Performance Issues - Optimize auth patterns to eliminate warnings

-- Drop current policies that are causing performance warnings
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_delete" ON profiles;

DROP POLICY IF EXISTS "posts_select" ON posts;
DROP POLICY IF EXISTS "posts_insert" ON posts;
DROP POLICY IF EXISTS "posts_update" ON posts;
DROP POLICY IF EXISTS "posts_delete" ON posts;

DROP POLICY IF EXISTS "comments_select" ON comments;
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_update" ON comments;
DROP POLICY IF EXISTS "comments_delete" ON comments;

DROP POLICY IF EXISTS "post_likes_select" ON post_likes;
DROP POLICY IF EXISTS "post_likes_insert" ON post_likes;
DROP POLICY IF EXISTS "post_likes_delete" ON post_likes;

DROP POLICY IF EXISTS "post_saves_select" ON post_saves;
DROP POLICY IF EXISTS "post_saves_insert" ON post_saves;
DROP POLICY IF EXISTS "post_saves_delete" ON post_saves;

DROP POLICY IF EXISTS "stories_select" ON stories;
DROP POLICY IF EXISTS "stories_insert" ON stories;
DROP POLICY IF EXISTS "stories_update" ON stories;
DROP POLICY IF EXISTS "stories_delete" ON stories;

DROP POLICY IF EXISTS "media_assets_select" ON media_assets;
DROP POLICY IF EXISTS "media_assets_insert" ON media_assets;
DROP POLICY IF EXISTS "media_assets_update" ON media_assets;
DROP POLICY IF EXISTS "media_assets_delete" ON media_assets;

DROP POLICY IF EXISTS "live_streams_select" ON live_streams;
DROP POLICY IF EXISTS "live_streams_insert" ON live_streams;
DROP POLICY IF EXISTS "live_streams_update" ON live_streams;
DROP POLICY IF EXISTS "live_streams_delete" ON live_streams;

DROP POLICY IF EXISTS "dating_ads_select" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_insert" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_update" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_delete" ON dating_ads;

DROP POLICY IF EXISTS "notifications_select" ON notifications;
DROP POLICY IF EXISTS "notifications_update" ON notifications;

-- Create highly optimized RLS policies using direct auth.uid() calls

-- Profiles table policies (optimized)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Posts table policies (optimized)
CREATE POLICY "posts_select" ON posts
  FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id);

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING (auth.uid() = creator_id);

-- Comments table policies (optimized)
CREATE POLICY "comments_select" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Post likes table policies (optimized)
CREATE POLICY "post_likes_select" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "post_likes_insert" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Post saves table policies (optimized)
CREATE POLICY "post_saves_select" ON post_saves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "post_saves_insert" ON post_saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_saves_delete" ON post_saves
  FOR DELETE USING (auth.uid() = user_id);

-- Stories table policies (optimized)
CREATE POLICY "stories_select" ON stories
  FOR SELECT USING (is_active = true AND expires_at > now());

CREATE POLICY "stories_insert" ON stories
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "stories_update" ON stories
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "stories_delete" ON stories
  FOR DELETE USING (auth.uid() = creator_id);

-- Media assets table policies (optimized)
CREATE POLICY "media_assets_select" ON media_assets
  FOR SELECT USING (access_level = 'public' OR auth.uid() = user_id);

CREATE POLICY "media_assets_insert" ON media_assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "media_assets_update" ON media_assets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "media_assets_delete" ON media_assets
  FOR DELETE USING (auth.uid() = user_id);

-- Live streams table policies (optimized)
CREATE POLICY "live_streams_select" ON live_streams
  FOR SELECT USING (NOT is_private OR auth.uid() = creator_id);

CREATE POLICY "live_streams_insert" ON live_streams
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "live_streams_update" ON live_streams
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "live_streams_delete" ON live_streams
  FOR DELETE USING (auth.uid() = creator_id);

-- Dating ads table policies (optimized)
CREATE POLICY "dating_ads_select" ON dating_ads
  FOR SELECT USING (is_active = true);

CREATE POLICY "dating_ads_insert" ON dating_ads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dating_ads_update" ON dating_ads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dating_ads_delete" ON dating_ads
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications table policies (optimized)
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Drop and recreate storage policies with optimized patterns
DROP POLICY IF EXISTS "media_select" ON storage.objects;
DROP POLICY IF EXISTS "media_insert" ON storage.objects;
DROP POLICY IF EXISTS "media_update" ON storage.objects;
DROP POLICY IF EXISTS "media_delete" ON storage.objects;

CREATE POLICY "media_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "media_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "media_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "media_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);
