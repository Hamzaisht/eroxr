
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
    // Database triggers handle this automatically when posts are liked/commented/etc.
    console.log('Trending metrics will be updated by database triggers for post:', postId);
    
    // No manual operations needed - everything is handled by triggers
  } catch (err) {
    console.error('Failed to update trending score:', err);
  }
}
