
-- Phase 1: Complete Database Cleanup - Drop all duplicate/conflicting RLS policies

-- Drop all existing RLS policies on profiles table
DROP POLICY IF EXISTS "profiles_public_select" ON profiles;
DROP POLICY IF EXISTS "profiles_user_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_user_update" ON profiles;
DROP POLICY IF EXISTS "profiles_user_delete" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_owner_write" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Drop all existing RLS policies on posts table
DROP POLICY IF EXISTS "posts_public_read" ON posts;
DROP POLICY IF EXISTS "posts_owner_write" ON posts;
DROP POLICY IF EXISTS "posts_authenticated_create" ON posts;
DROP POLICY IF EXISTS "posts_creator_update" ON posts;
DROP POLICY IF EXISTS "posts_creator_delete" ON posts;
DROP POLICY IF EXISTS "Anyone can view public posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Drop all existing RLS policies on comments table
DROP POLICY IF EXISTS "comments_public_read" ON comments;
DROP POLICY IF EXISTS "comments_owner_write" ON comments;
DROP POLICY IF EXISTS "comments_authenticated_create" ON comments;
DROP POLICY IF EXISTS "comments_creator_update" ON comments;
DROP POLICY IF EXISTS "comments_creator_delete" ON comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Drop all existing RLS policies on post_likes table
DROP POLICY IF EXISTS "post_likes_public_read" ON post_likes;
DROP POLICY IF EXISTS "post_likes_owner_write" ON post_likes;
DROP POLICY IF EXISTS "post_likes_authenticated_create" ON post_likes;
DROP POLICY IF EXISTS "post_likes_creator_delete" ON post_likes;
DROP POLICY IF EXISTS "Anyone can view post likes" ON post_likes;
DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON post_likes;

-- Drop all existing RLS policies on post_saves table
DROP POLICY IF EXISTS "post_saves_public_read" ON post_saves;
DROP POLICY IF EXISTS "post_saves_owner_write" ON post_saves;
DROP POLICY IF EXISTS "post_saves_authenticated_create" ON post_saves;
DROP POLICY IF EXISTS "post_saves_creator_delete" ON post_saves;
DROP POLICY IF EXISTS "Users can view their own saves" ON post_saves;
DROP POLICY IF EXISTS "Users can save posts" ON post_saves;
DROP POLICY IF EXISTS "Users can unsave their own saves" ON post_saves;

-- Drop all existing RLS policies on stories table
DROP POLICY IF EXISTS "stories_public_read" ON stories;
DROP POLICY IF EXISTS "stories_owner_write" ON stories;
DROP POLICY IF EXISTS "stories_authenticated_create" ON stories;
DROP POLICY IF EXISTS "stories_creator_update" ON stories;
DROP POLICY IF EXISTS "stories_creator_delete" ON stories;
DROP POLICY IF EXISTS "Anyone can view active stories" ON stories;
DROP POLICY IF EXISTS "Users can create stories" ON stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;

-- Drop all existing RLS policies on media_assets table
DROP POLICY IF EXISTS "media_assets_public_read" ON media_assets;
DROP POLICY IF EXISTS "media_assets_owner_write" ON media_assets;
DROP POLICY IF EXISTS "media_assets_authenticated_create" ON media_assets;
DROP POLICY IF EXISTS "media_assets_creator_update" ON media_assets;
DROP POLICY IF EXISTS "media_assets_creator_delete" ON media_assets;
DROP POLICY IF EXISTS "Anyone can view public media" ON media_assets;
DROP POLICY IF EXISTS "Users can upload media" ON media_assets;
DROP POLICY IF EXISTS "Users can update their own media" ON media_assets;
DROP POLICY IF EXISTS "Users can delete their own media" ON media_assets;

-- Drop all existing RLS policies on live_streams table
DROP POLICY IF EXISTS "live_streams_public_read" ON live_streams;
DROP POLICY IF EXISTS "live_streams_owner_write" ON live_streams;
DROP POLICY IF EXISTS "live_streams_authenticated_create" ON live_streams;
DROP POLICY IF EXISTS "live_streams_creator_update" ON live_streams;
DROP POLICY IF EXISTS "live_streams_creator_delete" ON live_streams;
DROP POLICY IF EXISTS "Anyone can view live streams" ON live_streams;
DROP POLICY IF EXISTS "Users can create live streams" ON live_streams;
DROP POLICY IF EXISTS "Users can update their own streams" ON live_streams;
DROP POLICY IF EXISTS "Users can delete their own streams" ON live_streams;

-- Drop all existing RLS policies on dating_ads table
DROP POLICY IF EXISTS "dating_ads_public_read" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_owner_write" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_authenticated_create" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_creator_update" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_creator_delete" ON dating_ads;
DROP POLICY IF EXISTS "Anyone can view active dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can create dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can update their own ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can delete their own ads" ON dating_ads;

-- Drop all existing RLS policies on notifications table
DROP POLICY IF EXISTS "notifications_owner_read" ON notifications;
DROP POLICY IF EXISTS "notifications_owner_update" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Create optimized RLS policies using (select auth.uid()) pattern

-- Profiles table policies
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING ((select auth.uid()) = id);

-- Posts table policies
CREATE POLICY "posts_select" ON posts
  FOR SELECT USING (visibility = 'public' OR (select auth.uid()) = creator_id);

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING ((select auth.uid()) = creator_id);

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING ((select auth.uid()) = creator_id);

-- Comments table policies
CREATE POLICY "comments_select" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "comments_update" ON comments
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "comments_delete" ON comments
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Post likes table policies
CREATE POLICY "post_likes_select" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "post_likes_insert" ON post_likes
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "post_likes_delete" ON post_likes
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Post saves table policies
CREATE POLICY "post_saves_select" ON post_saves
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "post_saves_insert" ON post_saves
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "post_saves_delete" ON post_saves
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Stories table policies
CREATE POLICY "stories_select" ON stories
  FOR SELECT USING (is_active = true AND expires_at > now());

CREATE POLICY "stories_insert" ON stories
  FOR INSERT WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY "stories_update" ON stories
  FOR UPDATE USING ((select auth.uid()) = creator_id);

CREATE POLICY "stories_delete" ON stories
  FOR DELETE USING ((select auth.uid()) = creator_id);

-- Media assets table policies
CREATE POLICY "media_assets_select" ON media_assets
  FOR SELECT USING (access_level = 'public' OR (select auth.uid()) = user_id);

CREATE POLICY "media_assets_insert" ON media_assets
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "media_assets_update" ON media_assets
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "media_assets_delete" ON media_assets
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Live streams table policies
CREATE POLICY "live_streams_select" ON live_streams
  FOR SELECT USING (NOT is_private OR (select auth.uid()) = creator_id);

CREATE POLICY "live_streams_insert" ON live_streams
  FOR INSERT WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY "live_streams_update" ON live_streams
  FOR UPDATE USING ((select auth.uid()) = creator_id);

CREATE POLICY "live_streams_delete" ON live_streams
  FOR DELETE USING ((select auth.uid()) = creator_id);

-- Dating ads table policies
CREATE POLICY "dating_ads_select" ON dating_ads
  FOR SELECT USING (is_active = true);

CREATE POLICY "dating_ads_insert" ON dating_ads
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "dating_ads_update" ON dating_ads
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "dating_ads_delete" ON dating_ads
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Notifications table policies
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for media if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 104857600, ARRAY['image/*', 'video/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for media bucket
DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "media_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "media_user_update" ON storage.objects;
DROP POLICY IF EXISTS "media_user_delete" ON storage.objects;

CREATE POLICY "media_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "media_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND (select auth.uid()) IS NOT NULL);

CREATE POLICY "media_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND (select auth.uid()) IS NOT NULL);

CREATE POLICY "media_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND (select auth.uid()) IS NOT NULL);
