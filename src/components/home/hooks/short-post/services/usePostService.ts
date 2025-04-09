
import { supabase } from '@/integrations/supabase/client';
import { useDbService } from './useDbService';

interface CreatePostParams {
  userId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  tags: string[];
  username: string;
  videoPath: string;
  videoFile: File;
}

export const usePostService = () => {
  const { checkColumnExists } = useDbService();

  /**
   * Creates a post in the database
   */
  const createPost = async ({
    userId,
    title,
    description,
    videoUrl,
    thumbnailUrl,
    isPremium,
    tags,
    username,
    videoPath,
    videoFile
  }: CreatePostParams): Promise<{ success: boolean; error?: string }> => {
    try {
      // Add appropriate tags
      const postTags = ['eros', 'short', ...(isPremium ? ['premium'] : [])];
      
      // Create the post object with all required fields
      const postObject: any = {
        creator_id: userId,
        content: title,
        video_urls: [videoUrl],
        video_thumbnail_url: thumbnailUrl, 
        visibility: isPremium ? 'subscribers_only' : 'public',
        video_processing_status: 'completed',
        tags: postTags,
        content_type: 'video',
        is_public: true // Important for RLS policy
      };

      // Add description if provided
      if (description && description.trim() !== '') {
        postObject.content_extended = description.trim();
      }

      // Add metadata if possible
      try {
        const hasMetadataColumn = await checkColumnExists('posts', 'metadata');
        
        if (hasMetadataColumn) {
          postObject.metadata = {
            watermarkUsername: username,
            creator: userId,
            uploadTimestamp: new Date().toISOString(),
            originalFilename: videoFile.name,
            publicUrl: videoUrl,
            bucketName: 'shorts',
            storagePath: videoPath,
            fileType: videoFile.type
          };
        }
      } catch (metadataError) {
        console.warn("Couldn't check for metadata column:", metadataError);
      }

      console.log("Inserting post record:", postObject);

      // Add a small delay to ensure storage processing is complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Insert the post into the database
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert(postObject)
        .select('id')
        .single();

      // Handle database insert error
      if (postError) {
        console.error("Post creation error:", postError);
        
        // Try again with minimal data if the first attempt fails
        if (postError.message.includes('violates row-level security policy')) {
          console.log("Retrying insert with explicit is_public flag");
          const minimalPostObject = {
            creator_id: userId,
            content: title,
            video_urls: [videoUrl],
            video_thumbnail_url: thumbnailUrl,
            is_public: true, // Explicit flag needed for RLS
            content_type: 'video',
            tags: postTags
          };
          
          const { error: retryPostError } = await supabase
            .from('posts')
            .insert(minimalPostObject);
            
          if (retryPostError) {
            throw new Error(`Failed to create post after retry: ${retryPostError.message}`);
          }
        } else {
          throw new Error(`Failed to create post: ${postError.message}`);
        }
      }

      console.log("Post created successfully:", postData);
      return { success: true };
    } catch (error: any) {
      console.error("Post creation error:", error);
      return { success: false, error: error.message || "Failed to create post" };
    }
  };

  return {
    createPost
  };
};
