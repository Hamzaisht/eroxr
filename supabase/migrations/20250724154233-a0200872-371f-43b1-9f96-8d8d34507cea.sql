-- Fix all remaining database security issues

-- 1. Add RLS policies for tables missing them
-- message_threads table
CREATE POLICY "Users can view threads they participate in" ON public.message_threads
FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create threads they participate in" ON public.message_threads
FOR INSERT WITH CHECK (auth.uid() = created_by AND auth.uid() = ANY(participants));

CREATE POLICY "Users can update threads they created" ON public.message_threads
FOR UPDATE USING (auth.uid() = created_by);

-- search_history table
CREATE POLICY "Users can manage their own search history" ON public.search_history
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- sounds table  
CREATE POLICY "Users can view all sounds" ON public.sounds
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own sounds" ON public.sounds
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_analytics table
CREATE POLICY "Users can view their own analytics" ON public.user_analytics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON public.user_analytics
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- user_interests table
CREATE POLICY "Users can manage their own interests" ON public.user_interests
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- video_reports table
CREATE POLICY "Users can create video reports" ON public.video_reports
FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can view all video reports" ON public.video_reports
FOR SELECT USING (is_admin_user(auth.uid()));

CREATE POLICY "Users can view their own reports" ON public.video_reports
FOR SELECT USING (auth.uid() = reported_by);

-- video_views table
CREATE POLICY "Users can view video views" ON public.video_views
FOR SELECT USING (true);

CREATE POLICY "Users can track their own video views" ON public.video_views
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Fix remaining function search_path issues
ALTER FUNCTION public.create_missed_call_notification() SET search_path = 'public';
ALTER FUNCTION public.detect_stack_depth() SET search_path = 'public';
ALTER FUNCTION public.get_content_view_count(uuid, text) SET search_path = 'public';
ALTER FUNCTION public.handle_post_comment() SET search_path = 'public';
ALTER FUNCTION public.handle_post_insert() SET search_path = 'public';
ALTER FUNCTION public.handle_post_like() SET search_path = 'public';
ALTER FUNCTION public.handle_post_media_action() SET search_path = 'public';
ALTER FUNCTION public.handle_post_save() SET search_path = 'public';
ALTER FUNCTION public.update_dating_ad_likes_count() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.update_video_folders_updated_at() SET search_path = 'public';

-- 3. Update outdated extensions to latest versions
-- Update pg_graphql to latest version
ALTER EXTENSION pg_graphql UPDATE;

-- Update pgsodium to latest version  
ALTER EXTENSION pgsodium UPDATE;

-- Update supabase_vault to latest version
ALTER EXTENSION supabase_vault UPDATE;

-- Update pg_stat_statements to latest version
ALTER EXTENSION pg_stat_statements UPDATE;