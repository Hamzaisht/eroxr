
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
    const { error } = await supabase
      .from('trending_content')
      .update(metrics)
      .eq('post_id', postId);
    
    if (error) {
      console.error('Error updating trending metrics:', error);
      return;
    }

    // Update the score using our function
    await supabase.rpc('update_trending_score', { p_post_id: postId });
  } catch (err) {
    console.error('Failed to update trending metrics:', err);
  }
}
