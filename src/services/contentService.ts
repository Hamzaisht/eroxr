
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling content-related operations
 */
export const ContentService = {
  /**
   * Track a view for a specific content item
   */
  async trackView(contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        content_id: contentId
      });
      
      if (error) {
        console.error('Error tracking view:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking view:', error);
      return false;
    }
  },
  
  /**
   * Toggle like for a content item
   */
  async toggleLike(contentId: string, userId: string): Promise<{
    success: boolean;
    liked: boolean;
    likesCount: number;
  }> {
    try {
      // Check if the user has already liked this post
      const { data: likeData, error: likeCheckError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', contentId)
        .eq('user_id', userId)
        .single();
      
      if (likeCheckError && likeCheckError.code !== 'PGRST116') {
        console.error('Error checking like status:', likeCheckError);
        throw likeCheckError;
      }
      
      const existingLike = likeData?.id;
      
      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike);
          
        if (deleteError) {
          throw deleteError;
        }
        
        // Decrement likes count
        const { data: updateData, error: updateError } = await supabase.rpc(
          'decrement_likes_count',
          { post_id: contentId }
        );
        
        if (updateError) {
          throw updateError;
        }
        
        return {
          success: true,
          liked: false,
          likesCount: updateData || 0
        };
      } else {
        // Like
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            post_id: contentId,
            user_id: userId
          });
          
        if (insertError) {
          throw insertError;
        }
        
        // Increment likes count
        const { data: updateData, error: updateError } = await supabase.rpc(
          'increment_likes_count',
          { post_id: contentId }
        );
        
        if (updateError) {
          throw updateError;
        }
        
        return {
          success: true,
          liked: true,
          likesCount: updateData || 1
        };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        liked: false,
        likesCount: 0
      };
    }
  },
  
  /**
   * Toggle save for a content item
   */
  async toggleSave(contentId: string, userId: string): Promise<{
    success: boolean;
    saved: boolean;
  }> {
    try {
      // Check if the user has already saved this post
      const { data: saveData, error: saveCheckError } = await supabase
        .from('saved_items')
        .select('id')
        .eq('post_id', contentId)
        .eq('user_id', userId)
        .single();
      
      if (saveCheckError && saveCheckError.code !== 'PGRST116') {
        console.error('Error checking save status:', saveCheckError);
        throw saveCheckError;
      }
      
      const existingSave = saveData?.id;
      
      if (existingSave) {
        // Unsave
        const { error: deleteError } = await supabase
          .from('saved_items')
          .delete()
          .eq('id', existingSave);
          
        if (deleteError) {
          throw deleteError;
        }
        
        return {
          success: true,
          saved: false
        };
      } else {
        // Save
        const { error: insertError } = await supabase
          .from('saved_items')
          .insert({
            post_id: contentId,
            user_id: userId
          });
          
        if (insertError) {
          throw insertError;
        }
        
        return {
          success: true,
          saved: true
        };
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      return {
        success: false,
        saved: false
      };
    }
  }
};

export default ContentService;
