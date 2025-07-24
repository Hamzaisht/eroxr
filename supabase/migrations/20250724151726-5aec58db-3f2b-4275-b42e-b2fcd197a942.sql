-- Fix critical security issues found in database linter

-- 1. Add missing RLS policies for tables that have RLS enabled but no policies
-- These are basic policies for demonstration - adjust based on actual business logic

-- RLS policy for posts table (if missing)
CREATE POLICY "Users can view public posts" ON public.posts
FOR SELECT USING (visibility = 'public' OR creator_id = auth.uid());

CREATE POLICY "Users can manage their own posts" ON public.posts
FOR ALL USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());

-- RLS policy for profiles table (if missing)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- RLS policy for videos table (if missing)
CREATE POLICY "Users can view public videos" ON public.videos
FOR SELECT USING (visibility = 'public' OR creator_id = auth.uid());

CREATE POLICY "Users can manage their own videos" ON public.videos
FOR ALL USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());

-- RLS policy for user_sessions table (if missing)
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policy for platform_subscriptions table (if missing)
CREATE POLICY "Users can view their own subscriptions" ON public.platform_subscriptions
FOR SELECT USING (user_id = auth.uid());

-- RLS policy for stories table (if missing)
CREATE POLICY "Users can view public stories" ON public.stories
FOR SELECT USING (visibility = 'public' OR creator_id = auth.uid());

CREATE POLICY "Users can manage their own stories" ON public.stories
FOR ALL USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());

-- RLS policy for story_views table (if missing)
CREATE POLICY "Users can view story views" ON public.story_views
FOR SELECT USING (true);

CREATE POLICY "Users can insert story views" ON public.story_views
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Fix function search_path issues by adding search_path to critical functions
-- This updates existing functions to include proper search_path for security

-- Update functions that don't have search_path set
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';
ALTER FUNCTION public.get_user_bookmarks(uuid) SET search_path = 'public';
ALTER FUNCTION public.user_has_premium_access(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_platform_subscription_status(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
ALTER FUNCTION public.sync_uploaded_videos() SET search_path = 'public';
ALTER FUNCTION public.get_content_performance(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.increment_counter(uuid, text, text) SET search_path = 'public';
ALTER FUNCTION public.get_top_trending_hashtags() SET search_path = 'public';
ALTER FUNCTION public.rls_bypass_profile_update(uuid, text, text, text, text, text, text[], boolean, text) SET search_path = 'public';
ALTER FUNCTION public.get_geographic_analytics(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.get_most_engaged_fans(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.get_conversion_funnel(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.get_creator_analytics(uuid, date, date) SET search_path = 'public';
ALTER FUNCTION public.get_earnings_timeline(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.assign_super_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.get_growth_analytics(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.get_streaming_analytics(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.get_content_analytics(uuid, integer) SET search_path = 'public';
ALTER FUNCTION public.is_super_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.check_username_available(text) SET search_path = 'public';
ALTER FUNCTION public.can_change_username(uuid) SET search_path = 'public';
ALTER FUNCTION public.can_change_dob(uuid) SET search_path = 'public';
ALTER FUNCTION public.is_verified_creator(uuid) SET search_path = 'public';
ALTER FUNCTION public.create_sample_analytics_data_for_user(uuid) SET search_path = 'public';
ALTER FUNCTION public.is_admin_user(uuid, text) SET search_path = 'public';
ALTER FUNCTION public.update_profile_service(uuid, text, text, text, text, text) SET search_path = 'public';
ALTER FUNCTION public.check_column_exists(text, text) SET search_path = 'public';