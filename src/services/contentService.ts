
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling posts, shorts, and other content
 */
export interface ContentActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Like a post or short
 */
export async function likeContent(contentId: string, type = 'post'): Promise<ContentActionResult> {
  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', contentId)
      .eq('user_id', supabase.auth.getUser().then(res => res.data.user?.id))
      .single();
      
    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (error) throw error;
      
      return { success: true, data: { liked: false } };
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: contentId });
        
      if (error) throw error;
      
      return { success: true, data: { liked: true } };
    }
  } catch (error: any) {
    console.error(`Error ${existingLike ? 'unliking' : 'liking'} content:`, error);
    return { 
      success: false, 
      error: error.message || `Failed to ${existingLike ? 'unlike' : 'like'} content` 
    };
  }
}

/**
 * Save a post or short
 */
export async function saveContent(contentId: string, type = 'post'): Promise<ContentActionResult> {
  try {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from('post_saves')
      .select('*')
      .eq('post_id', contentId)
      .eq('user_id', supabase.auth.getUser().then(res => res.data.user?.id))
      .single();
      
    if (existingSave) {
      // Unsave
      const { error } = await supabase
        .from('post_saves')
        .delete()
        .eq('id', existingSave.id);
        
      if (error) throw error;
      
      return { success: true, data: { saved: false } };
    } else {
      // Save
      const { error } = await supabase
        .from('post_saves')
        .insert({ post_id: contentId });
        
      if (error) throw error;
      
      return { success: true, data: { saved: true } };
    }
  } catch (error: any) {
    console.error(`Error ${existingSave ? 'unsaving' : 'saving'} content:`, error);
    return { 
      success: false, 
      error: error.message || `Failed to ${existingSave ? 'unsave' : 'save'} content` 
    };
  }
}

/**
 * Track a view for a post or short
 */
export async function trackView(contentId: string, type = 'post'): Promise<ContentActionResult> {
  try {
    const { error } = await supabase.rpc('increment_counter', {
      row_id: contentId,
      counter_name: 'view_count',
      table_name: type
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return { success: false, error: error.message || 'Failed to track view' };
  }
}

/**
 * Track a share for a post or short
 */
export async function trackShare(contentId: string, type = 'post'): Promise<ContentActionResult> {
  try {
    const { error } = await supabase.rpc('increment_counter', {
      row_id: contentId,
      counter_name: 'share_count',
      table_name: type
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error tracking share:', error);
    return { success: false, error: error.message || 'Failed to track share' };
  }
}

/**
 * Delete content (post or short)
 */
export async function deleteContent(contentId: string, type = 'post'): Promise<ContentActionResult> {
  try {
    const { error } = await supabase
      .from(type === 'post' ? 'posts' : 'posts') // Using posts table for both types since shorts are in posts
      .delete()
      .eq('id', contentId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting content:', error);
    return { success: false, error: error.message || 'Failed to delete content' };
  }
}

/**
 * Add a comment to a post or short
 */
export async function addComment(
  contentId: string, 
  content: string, 
  type = 'post'
): Promise<ContentActionResult> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({ 
        post_id: contentId, 
        content
      })
      .select('*, profiles(username, avatar_url)')
      .single();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message || 'Failed to add comment' };
  }
}

/**
 * Get comments for a post or short
 */
export async function getComments(
  contentId: string,
  type = 'post',
  options = { limit: 20, page: 0 }
): Promise<ContentActionResult> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', contentId)
      .order('created_at', { ascending: false })
      .range(options.page * options.limit, (options.page + 1) * options.limit - 1);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return { success: false, error: error.message || 'Failed to fetch comments' };
  }
}
