
import { supabase } from "@/integrations/supabase/client";

/**
 * Update trending metrics for a post
 * Database triggers now handle all trending_content updates automatically
 */
export async function updateTrendingMetrics(
  postId: string,
  metrics: {
    likes?: number;
    comments?: number;
    bookmarks?: number;
    screenshots?: number;
  }
) {
  try {
    console.log('Trending metrics are automatically updated by database triggers for post:', postId);
    
    // Database triggers handle everything automatically when posts are liked/commented/etc.
    // No manual operations needed
  } catch (err) {
    console.error('Error in trending metrics helper:', err);
  }
}

/**
 * Get trending posts with their metrics
 */
export async function getTrendingPosts(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('trending_content')
      .select(`
        *,
        posts!inner (
          id,
          content,
          created_at,
          creator_id,
          visibility,
          likes_count,
          comments_count,
          profiles!posts_creator_id_fkey (
            id,
            username
          )
        )
      `)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to get trending posts:', error);
    throw error;
  }
}
