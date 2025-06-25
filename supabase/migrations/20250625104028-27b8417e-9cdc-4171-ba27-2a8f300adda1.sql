
-- Comprehensive Index Audit - Find all indexes and identify duplicates
-- This will help us identify performance issues from duplicate indexes

-- First, let's see all indexes in the database
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check for potential duplicate indexes by looking at similar column patterns
WITH index_analysis AS (
    SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef,
        -- Extract column names from index definition
        regexp_replace(
            regexp_replace(indexdef, '.*\((.*)\).*', '\1'),
            '\s+',
            '',
            'g'
        ) as columns_normalized
    FROM pg_indexes 
    WHERE schemaname = 'public'
)
SELECT 
    tablename,
    columns_normalized,
    COUNT(*) as duplicate_count,
    array_agg(indexname) as index_names
FROM index_analysis
GROUP BY tablename, columns_normalized
HAVING COUNT(*) > 1
ORDER BY tablename, duplicate_count DESC;

-- Also check for indexes that might be redundant (subset of other indexes)
SELECT 
    i1.tablename,
    i1.indexname as potentially_redundant_index,
    i1.indexdef as redundant_def,
    i2.indexname as covering_index,
    i2.indexdef as covering_def
FROM pg_indexes i1
JOIN pg_indexes i2 ON i1.tablename = i2.tablename 
    AND i1.indexname != i2.indexname
    AND i1.schemaname = 'public' 
    AND i2.schemaname = 'public'
WHERE i2.indexdef LIKE '%' || 
    regexp_replace(
        regexp_replace(i1.indexdef, '.*\((.*)\).*', '\1'),
        '\s+',
        '',
        'g'
    ) || '%'
ORDER BY i1.tablename, i1.indexname;
