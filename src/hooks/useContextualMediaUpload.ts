
import { useMediaUpload } from './useMediaUpload';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

type MediaContext = 'post' | 'story' | 'message' | 'short' | 'avatar';

interface UploadResult {
  success: boolean;
  url: string | null;
  error: string | null;
}

/**
 * Hook for handling contextual media uploads (posts, stories, etc.)
 */
export const useContextualMediaUpload = (context: MediaContext) => {
  const { uploadMedia, uploadState } = useMediaUpload();
  const session = useSession();
  const { toast } = useToast();

  // Map context to bucket name
  const getBucketName = (context: MediaContext): string => {
    switch (context) {
      case 'post':
        return 'posts';
      case 'story':
        return 'stories';
      case 'message':
        return 'messages';
      case 'short':
        return 'shorts';
      case 'avatar':
        return 'avatars';
      default:
        return 'media';
    }
  };

  /**
   * Upload a media file in the given context
   */
  const uploadFile = async (file: File): Promise<UploadResult> => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload media.",
        variant: "destructive"
      });
      return { success: false, url: null, error: "Not authenticated" };
    }
    
    try {
      const result = await uploadMedia(file, { contentCategory: context as any });
      
      if (!result.success) {
        toast({
          title: "Upload Failed",
          description: "Could not upload your media file.",
          variant: "destructive"
        });
        return result;
      }
      
      toast({
        title: "Upload Complete",
        description: "Your media has been uploaded successfully."
      });
      
      return result;
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "An error occurred during upload.",
        variant: "destructive"
      });
      return { success: false, url: null, error: error.message || "Unknown error" };
    }
  };

  return {
    uploadFile,
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    error: uploadState.error
  };
};
