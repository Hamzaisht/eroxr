
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling content-related operations
 */
export const ContentService = {
  /**
   * Track a view for a specific content item
   */
  async trackViewCount(contentId: string): Promise<boolean> {
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
  },
  
  /**
   * Like/unlike a content item with content type
   */
  async likeContent(contentId: string, contentType: string = 'post'): Promise<{
    success: boolean;
    data?: { liked: boolean; likesCount: number };
    error?: string;
  }> {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }
      
      // Use the existing toggle like functionality
      const result = await this.toggleLike(contentId, user.id);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Failed to toggle like status'
        };
      }
      
      return {
        success: true,
        data: {
          liked: result.liked,
          likesCount: result.likesCount
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  },
  
  /**
   * Save/unsave a content item with content type
   */
  async saveContent(contentId: string, contentType: string = 'post'): Promise<{
    success: boolean;
    data?: { saved: boolean };
    error?: string;
  }> {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }
      
      // Use the existing toggle save functionality
      const result = await this.toggleSave(contentId, user.id);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Failed to toggle save status'
        };
      }
      
      return {
        success: true,
        data: {
          saved: result.saved
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  },
  
  /**
   * Track a view for a content item with content type
   */
  async trackView(contentId: string, contentType: string = 'post'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Use the trackViewCount functionality
      const success = await this.trackViewCount(contentId);
      
      return {
        success
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  },
  
  /**
   * Track a share for a content item with content type
   */
  async trackShare(contentId: string, contentType: string = 'post'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Implement share tracking
      const { error } = await supabase
        .from('posts')
        .update({ 
          share_count: supabase.rpc('increment', { count: 1 }),
          last_engagement_at: new Date().toISOString()
        })
        .eq('id', contentId);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  },
  
  /**
   * Delete a content item with content type
   */
  async deleteContent(contentId: string, contentType: string = 'post'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await supabase
        .from(contentType === 'post' ? 'posts' : 'posts')
        .delete()
        .eq('id', contentId);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};

export default ContentService;
