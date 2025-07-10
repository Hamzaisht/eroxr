-- Create function to get most engaged fans for a creator
CREATE OR REPLACE FUNCTION public.get_most_engaged_fans(p_creator_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE(
  user_id uuid,
  total_spent numeric,
  total_purchases bigint,
  total_likes bigint,
  total_comments bigint,
  engagement_score numeric,
  last_interaction timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_purchases AS (
    SELECT 
      pp.user_id,
      COUNT(*) as purchase_count,
      SUM(pp.amount) as total_amount,
      MAX(pp.created_at) as last_purchase
    FROM post_purchases pp
    JOIN posts p ON pp.post_id = p.id
    WHERE p.creator_id = p_creator_id
    GROUP BY pp.user_id
  ),
  user_likes AS (
    SELECT 
      pl.user_id,
      COUNT(*) as like_count,
      MAX(pl.created_at) as last_like
    FROM post_likes pl
    JOIN posts p ON pl.post_id = p.id
    WHERE p.creator_id = p_creator_id
    GROUP BY pl.user_id
  ),
  user_comments AS (
    SELECT 
      c.user_id,
      COUNT(*) as comment_count,
      MAX(c.created_at) as last_comment
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    WHERE p.creator_id = p_creator_id
    GROUP BY c.user_id
  )
  SELECT 
    COALESCE(up.user_id, ul.user_id, uc.user_id) as user_id,
    COALESCE(up.total_amount, 0) as total_spent,
    COALESCE(up.purchase_count, 0) as total_purchases,
    COALESCE(ul.like_count, 0) as total_likes,
    COALESCE(uc.comment_count, 0) as total_comments,
    (
      COALESCE(up.total_amount, 0) * 0.4 +
      COALESCE(up.purchase_count, 0) * 10 +
      COALESCE(ul.like_count, 0) * 2 +
      COALESCE(uc.comment_count, 0) * 5
    ) as engagement_score,
    GREATEST(
      COALESCE(up.last_purchase, '1970-01-01'::timestamp),
      COALESCE(ul.last_like, '1970-01-01'::timestamp),
      COALESCE(uc.last_comment, '1970-01-01'::timestamp)
    ) as last_interaction
  FROM user_purchases up
  FULL OUTER JOIN user_likes ul ON up.user_id = ul.user_id
  FULL OUTER JOIN user_comments uc ON COALESCE(up.user_id, ul.user_id) = uc.user_id
  WHERE COALESCE(up.user_id, ul.user_id, uc.user_id) IS NOT NULL
  ORDER BY engagement_score DESC
  LIMIT p_limit;
END;
$$;

-- Create function to get conversion funnel data
CREATE OR REPLACE FUNCTION public.get_conversion_funnel(p_creator_id uuid, p_days integer DEFAULT 30)
RETURNS TABLE(
  stage text,
  count bigint,
  percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_views bigint;
  total_interactions bigint;
  total_subscribers bigint;
  total_purchases bigint;
  profile_views bigint;
BEGIN
  -- Get total content views for the creator
  SELECT COALESCE(SUM(view_count), 0) INTO total_views
  FROM posts 
  WHERE creator_id = p_creator_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Get total interactions (likes + comments)
  SELECT COALESCE(SUM(likes_count + comments_count), 0) INTO total_interactions
  FROM posts 
  WHERE creator_id = p_creator_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Get subscriber count
  SELECT COUNT(*) INTO total_subscribers
  FROM creator_subscriptions 
  WHERE creator_id = p_creator_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Get purchase count  
  SELECT COUNT(*) INTO total_purchases
  FROM post_purchases pp
  JOIN posts p ON pp.post_id = p.id
  WHERE p.creator_id = p_creator_id
    AND pp.created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Estimate profile views (use session count as proxy)
  SELECT COALESCE(COUNT(*), 0) INTO profile_views
  FROM user_sessions
  WHERE creator_id = p_creator_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Use profile views as base, or total views if higher
  profile_views := GREATEST(profile_views, total_views);

  RETURN QUERY
  WITH funnel_data AS (
    SELECT 'Profile Views'::text as stage, profile_views as count, 100.0 as percentage
    UNION ALL
    SELECT 'Content Views'::text, total_views, 
           CASE WHEN profile_views > 0 THEN (total_views::numeric / profile_views::numeric * 100) ELSE 0 END
    UNION ALL
    SELECT 'Interactions'::text, total_interactions,
           CASE WHEN profile_views > 0 THEN (total_interactions::numeric / profile_views::numeric * 100) ELSE 0 END
    UNION ALL
    SELECT 'Subscriptions'::text, total_subscribers,
           CASE WHEN profile_views > 0 THEN (total_subscribers::numeric / profile_views::numeric * 100) ELSE 0 END
    UNION ALL
    SELECT 'Purchases'::text, total_purchases,
           CASE WHEN profile_views > 0 THEN (total_purchases::numeric / profile_views::numeric * 100) ELSE 0 END
  )
  SELECT f.stage, f.count, ROUND(f.percentage, 2) as percentage
  FROM funnel_data f
  ORDER BY f.percentage DESC;
END;
$$;