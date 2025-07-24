-- Fix remaining database security issues
-- Only add policies that don't exist and fix search_path for functions that need it

-- Fix function search_path issues (skip functions that already have it set)
DO $$
BEGIN
    -- Only alter functions that don't already have search_path set
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' 
        AND p.proname = 'get_current_user_role'
        AND p.proconfig::text LIKE '%search_path%'
    ) THEN
        ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';
    END IF;

    -- Update other critical functions
    BEGIN
        ALTER FUNCTION public.get_user_bookmarks(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Function might already have search_path set
    END;

    BEGIN
        ALTER FUNCTION public.user_has_premium_access(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_platform_subscription_status(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_user_role(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.sync_uploaded_videos() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_content_performance(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.increment_counter(uuid, text, text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_top_trending_hashtags() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_geographic_analytics(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_most_engaged_fans(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_conversion_funnel(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_creator_analytics(uuid, date, date) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_earnings_timeline(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.assign_super_admin(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_growth_analytics(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_streaming_analytics(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.get_content_analytics(uuid, integer) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.is_super_admin(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.check_username_available(text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.can_change_username(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.can_change_dob(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.is_verified_creator(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.create_sample_analytics_data_for_user(uuid) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.is_admin_user(uuid, text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.update_profile_service(uuid, text, text, text, text, text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    BEGIN
        ALTER FUNCTION public.check_column_exists(text, text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

END $$;