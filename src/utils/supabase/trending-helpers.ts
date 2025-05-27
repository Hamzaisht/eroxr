
import { supabase } from "@/integrations/supabase/client";

/**
 * Insert a post into trending content table
 */
export async function insertTrendingContent(postId: string) {
  try {
    const { error } = await supabase
      .from('trending_content')
      .insert({
        post_id: postId,
        score: 0,
        likes: 0,
        comments: 0,
        bookmarks: 0,
        screenshots: 0
      });
    
    if (error) {
      console.error('Error inserting trending content:', error);
    }
  } catch (err) {
    console.error('Failed to insert trending content:', err);
  }
}

/**
 * Update trending metrics for a post
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
