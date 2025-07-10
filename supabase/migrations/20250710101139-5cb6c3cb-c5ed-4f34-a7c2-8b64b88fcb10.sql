-- Fix the get_content_performance function to return correct data types
CREATE OR REPLACE FUNCTION public.get_content_performance(p_creator_id uuid, p_limit integer DEFAULT 10)
 RETURNS TABLE(post_id uuid, content text, created_at timestamp with time zone, views integer, likes integer, comments integer, earnings numeric, engagement_score double precision, content_type text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as post_id,
    p.content,
    p.created_at,
    COALESCE(p.view_count, 0) as views,
    COALESCE(p.likes_count, 0) as likes,
    COALESCE(p.comments_count, 0) as comments,
    COALESCE(SUM(pp.amount), 0) as earnings,
    COALESCE(p.engagement_score, 0.0) as engagement_score,
    CASE 
      WHEN array_length(p.video_urls, 1) > 0 THEN 'video'
      WHEN array_length(p.media_url, 1) > 0 THEN 'image'
      ELSE 'text'
    END as content_type
  FROM posts p
  LEFT JOIN post_purchases pp ON p.id = pp.post_id
  WHERE p.creator_id = p_creator_id
  GROUP BY p.id, p.content, p.created_at, p.view_count, p.likes_count, p.comments_count, p.engagement_score, p.video_urls, p.media_url
  ORDER BY earnings DESC, p.engagement_score DESC
  LIMIT p_limit;
END;
$function$;