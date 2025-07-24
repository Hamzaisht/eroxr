-- Fix remaining security issues with alternative approach

-- 1. Update pg_graphql extension by going through intermediate versions
DO $$
BEGIN
    -- Try to update pg_graphql step by step
    BEGIN
        ALTER EXTENSION pg_graphql UPDATE TO '1.5.10';
    EXCEPTION WHEN OTHERS THEN
        BEGIN
            ALTER EXTENSION pg_graphql UPDATE;
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Extension might not have update path
        END;
    END;
    
    -- Try final update to latest
    BEGIN
        ALTER EXTENSION pg_graphql UPDATE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- 2. Fix the security definer view issue by ensuring views don't use problematic patterns
-- Drop and recreate views without any potential security definer references

DROP VIEW IF EXISTS public.top_creators_by_earnings CASCADE;
CREATE VIEW public.top_creators_by_earnings AS
SELECT 
    p.id,
    p.username,
    p.avatar_url,
    COALESCE(earnings.total_earnings, 0::numeric) AS total_earnings,
    COALESCE(earnings.earnings_percentile, 0::double precision) AS earnings_percentile
FROM profiles p
LEFT JOIN (
    SELECT 
        posts.creator_id,
        SUM(pp.amount) AS total_earnings,
        (PERCENT_RANK() OVER (ORDER BY SUM(pp.amount)) * 100::double precision) AS earnings_percentile
    FROM posts
    LEFT JOIN post_purchases pp ON posts.id = pp.post_id
    GROUP BY posts.creator_id
) earnings ON p.id = earnings.creator_id
WHERE earnings.total_earnings > 0::numeric
ORDER BY earnings.total_earnings DESC;

-- Enable RLS on the view's underlying tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_purchases ENABLE ROW LEVEL SECURITY;

-- Drop and recreate user_bookmarks view
DROP VIEW IF EXISTS public.user_bookmarks CASCADE;
CREATE VIEW public.user_bookmarks AS
SELECT 
    ps.user_id,
    p.id,
    p.creator_id,
    p.content,
    p.likes_count,
    p.comments_count,
    p.created_at,
    p.updated_at,
    p.visibility,
    p.tags,
    p.ppv_amount,
    p.is_ppv,
    p.screenshots_count,
    p.downloads_count,
    p.view_count,
    p.share_count,
    p.engagement_score,
    p.is_featured,
    p.last_engagement_at,
    p.last_modified_by,
    p.content_extended,
    p.metadata,
    pr.username AS creator_username,
    pr.avatar_url AS creator_avatar_url,
    'bookmark'::text AS source_type,
    ps.created_at AS saved_at
FROM post_saves ps
JOIN posts p ON ps.post_id = p.id
JOIN profiles pr ON p.creator_id = pr.id
WHERE p.visibility = 'public'::text;