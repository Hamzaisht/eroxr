-- Investigate and fix stack depth limit by checking triggers and functions
-- Check for triggers that might cause infinite recursion using correct column names

SELECT 
    pn.nspname as schema_name,
    pc.relname as table_name, 
    pt.tgname as trigger_name,
    pp.proname as function_name,
    pt.tgenabled
FROM pg_trigger pt
JOIN pg_class pc ON pt.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
JOIN pg_proc pp ON pt.tgfoid = pp.oid
WHERE pn.nspname = 'public' 
AND NOT pt.tgisinternal
ORDER BY pc.relname, pt.tgname;

-- Check what RLS policies exist
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('posts', 'post_likes', 'comments', 'profiles', 'media_assets')
ORDER BY tablename, policyname;