-- Investigate and fix stack depth limit by checking triggers and functions
-- First, let's see what triggers exist that might be causing recursion

-- Check for triggers that might cause infinite recursion
SELECT 
    schemaname,
    tablename, 
    triggername,
    tgtype,
    proname as function_name
FROM pg_trigger pt
JOIN pg_class pc ON pt.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
JOIN pg_proc pp ON pt.tgfoid = pp.oid
WHERE schemaname = 'public' 
AND NOT tgisinternal
ORDER BY tablename, triggername;

-- Also check what RLS policies still exist to ensure cleanup worked
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('posts', 'post_likes', 'comments', 'profiles', 'media_assets')
ORDER BY tablename, policyname;