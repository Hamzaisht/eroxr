
import { supabase } from '@/integrations/supabase/client';
import { useDbService } from './useDbService';

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
      
      if (isShortStory) {
        // Check if content_type column exists in stories table
        const hasContentType = await checkColumnExists('stories', 'content_type');
        const hasIsPublic = await checkColumnExists('stories', 'is_public');
        
        // Create story record
        const storyData: any = {
          creator_id: supabase.auth.getUser().data.user?.id,
          video_url: videoUrl,
          duration: 30, // 30 seconds for stories
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
        };
        
        // Add content_type field if column exists
        if (hasContentType) {
          storyData.content_type = 'video';
        }
        
        // Add is_public field if column exists (it should now)
        if (hasIsPublic) {
          storyData.is_public = visibility === 'public';
        }
        
        const { data, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select();
          
        return { data: data?.[0] || null, error: error?.message };
      } else {
        // Create post record
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              creator_id: supabase.auth.getUser().data.user?.id,
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
