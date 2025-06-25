
-- Fixed Final Database Health Check - Corrected column references
-- This version uses the correct system catalog column names

-- 1. Database Lint Check - Verify RLS policies are properly configured
DO $$
DECLARE
    policy_count INTEGER;
    table_record RECORD;
    missing_rls TEXT[] := '{}';
BEGIN
    -- Check each table has RLS enabled and proper policies
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'posts', 'comments', 'post_likes', 'post_saves', 
                         'stories', 'media_assets', 'live_streams', 'dating_ads', 'notifications')
    LOOP
        -- Check if RLS is enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = 'public' 
            AND c.relname = table_record.tablename 
            AND c.relrowsecurity = true
        ) THEN
            missing_rls := array_append(missing_rls, table_record.tablename || ' - RLS not enabled');
        END IF;
        
        -- Check if table has at least one policy
        SELECT COUNT(*) INTO policy_count
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = table_record.tablename;
        
        IF policy_count = 0 THEN
            missing_rls := array_append(missing_rls, table_record.tablename || ' - No RLS policies');
        END IF;
    END LOOP;
    
    IF array_length(missing_rls, 1) > 0 THEN
        RAISE NOTICE 'RLS Issues Found: %', array_to_string(missing_rls, ', ');
    ELSE
        RAISE NOTICE '✅ All critical tables have proper RLS configuration';
    END IF;
END $$;

-- 2. Performance Analysis for Critical Tables
ANALYZE profiles;
ANALYZE media_assets;
ANALYZE dating_ads;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'media_assets', 'dating_ads')
ORDER BY tablename, attname;

-- Check index usage with correct column names
SELECT 
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND relname IN ('profiles', 'media_assets', 'dating_ads')
ORDER BY relname, idx_scan DESC;

-- 3. RLS Policy Verification
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'posts', 'comments', 'post_likes', 'post_saves', 
                 'stories', 'media_assets', 'live_streams', 'dating_ads', 'notifications')
ORDER BY tablename, cmd, policyname;

-- 4. Check for duplicate policies
WITH policy_analysis AS (
    SELECT 
        schemaname,
        tablename,
        cmd,
        COALESCE(qual, 'NULL') as qual_text,
        COALESCE(with_check, 'NULL') as with_check_text,
        COUNT(*) as policy_count,
        array_agg(policyname) as policy_names
    FROM pg_policies 
    WHERE schemaname = 'public'
    GROUP BY schemaname, tablename, cmd, qual, with_check
)
SELECT 
    tablename,
    cmd,
    policy_count,
    policy_names
FROM policy_analysis 
WHERE policy_count > 1
ORDER BY tablename, cmd;

-- 5. Database Health Summary
SELECT 
    'Database Health Check Complete' as status,
    NOW() as completion_time;
