
import { supabase } from '@/integrations/supabase/client';
import { useDbService } from './useDbService';
import { getUsernameForWatermark } from '@/utils/watermarkUtils';

export const usePostService = () => {
  const { checkColumnExists } = useDbService();

  const createPostWithVideo = async (
    videoUrl: string,
    caption: string,
    visibility: 'public' | 'subscribers_only' = 'public',
    tags: string[] = []
  ) => {
    try {
      // Decide whether to create a story or a post
      const isShortStory = caption.length <= 50;
      
      // Properly await the auth user response
      const { data: { user } } = await supabase.auth.getSession();
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Get username for watermark
      const username = await getUsernameForWatermark(userId);
      
      if (isShortStory) {
        // Check if optional columns exist in stories table
        const hasContentType = await checkColumnExists('stories', 'content_type');
        const hasIsPublic = await checkColumnExists('stories', 'is_public');
        const hasMediaType = await checkColumnExists('stories', 'media_type');
        
        // Determine content type based on video URL
        const contentType = videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.toLowerCase().endsWith('.mov') 
          ? 'video' 
          : 'image';
        
        // Create story record with required fields
        const storyData: any = {
          creator_id: userId,
          video_url: videoUrl,
          duration: 30, // 30 seconds for stories
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
        };
        
        // Add optional fields if columns exist
        if (hasContentType) {
          storyData.content_type = contentType;
        }
        
        if (hasMediaType) {
          storyData.media_type = contentType;
        }
        
        if (hasIsPublic) {
          storyData.is_public = visibility === 'public';
        }
        
        // Insert the story record
        const { data, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select();
          
        if (error) {
          console.error('Error creating story:', error);
        }
          
        return { data: data?.[0] || null, error: error?.message };
      } else {
        // Create post record
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              creator_id: userId,
              content: caption,
              video_urls: [videoUrl],
              visibility: visibility,
              tags: tags.length > 0 ? tags : null
            }
          ])
          .select();
          
        return { data: data?.[0] || null, error: error?.message };
      }
    } catch (err: any) {
      console.error('Error creating post/story:', err);
      return { data: null, error: err.message };
    }
  };

  return {
    createPostWithVideo
  };
};
