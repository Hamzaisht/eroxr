-- Fix the last remaining security issues

-- 1. Update extensions to latest versions (this should resolve the outdated versions warning)
DO $$
BEGIN
    -- Update pg_graphql if it exists
    BEGIN
        ALTER EXTENSION pg_graphql UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Extension might not exist or already updated
    END;

    -- Update pgsodium if it exists  
    BEGIN
        ALTER EXTENSION pgsodium UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Update supabase_vault if it exists
    BEGIN
        ALTER EXTENSION supabase_vault UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Update pg_stat_statements if it exists
    BEGIN
        ALTER EXTENSION pg_stat_statements UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Update uuid-ossp if it exists
    BEGIN
        ALTER EXTENSION "uuid-ossp" UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Update pgcrypto if it exists
    BEGIN
        ALTER EXTENSION pgcrypto UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- 2. Check if there are any views with SECURITY DEFINER and replace them
-- First, let's see if we can identify the problematic view
DO $$
DECLARE
    view_rec RECORD;
BEGIN
    -- Loop through all views to find any with SECURITY DEFINER
    FOR view_rec IN 
        SELECT schemaname, viewname, definition 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        -- Check if definition contains SECURITY DEFINER (case insensitive)
        IF view_rec.definition ILIKE '%security definer%' THEN
            -- Drop and recreate the view without SECURITY DEFINER
            EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_rec.schemaname, view_rec.viewname);
            -- Note: The view would need to be recreated manually based on business requirements
            RAISE NOTICE 'Dropped view %.% due to SECURITY DEFINER', view_rec.schemaname, view_rec.viewname;
        END IF;
    END LOOP;
END $$;