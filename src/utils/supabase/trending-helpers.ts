
import { supabase } from "@/integrations/supabase/client";

/**
 * Update trending metrics for a post
 * Note: trending_content is now a regular table with triggers that auto-update scores
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
    // DO NOT insert/update trending_content directly!
    // Database triggers handle this automatically when posts are liked/commented/etc.
    console.log('Trending metrics will be updated by database triggers for post:', postId);
    
    // If you need to manually trigger a score update, use the RPC function
    await supabase.rpc('update_trending_score', { p_post_id: postId });
  } catch (err) {
    console.error('Failed to update trending score:', err);
  }
}
