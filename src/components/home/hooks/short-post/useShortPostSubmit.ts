
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useOptimisticUpload } from "@/hooks/useOptimisticUpload";
import { useStorageService } from "./services/useStorageService";
import { useWatermarkService } from "./services/useWatermarkService";
import { usePostService } from "./services/usePostService";
import { addCacheBuster } from "./utils/urlUtils";

interface ShortPostSubmitParams {
  title: string;
  description?: string;
  videoFile: File;
  isPremium?: boolean;
}

export const useShortPostSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState<string>('eroxr');
  const { toast } = useToast();
  const session = useSession();
  const { uploadState, simulateProgressiveUpload, resetUploadState, retryUpload } = useOptimisticUpload();
  const { getFullPublicUrl, uploadVideoToStorage } = useStorageService();
  const { getUsernameForWatermark } = useWatermarkService();
  const { createPost } = usePostService();

  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  useEffect(() => {
    if (session?.user?.id) {
      getUsernameForWatermark(session.user.id).then(name => {
        if (name) setUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }
  }, [session?.user?.id]);

  const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Unsupported file type. Allowed types: ${ALLOWED_VIDEO_TYPES.map(t => t.replace('video/', '')).join(', ')}`
      };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
      };
    }
    
    return { valid: true };
  };

  const submitShortPost = async ({
    title, 
    description, 
    videoFile,
    isPremium = false
  }: ShortPostSubmitParams) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload a short",
        variant: "destructive"
      });
      return false;
    }

    const validation = validateVideoFile(videoFile);
    if (!validation.valid) {
      toast({
        title: "Invalid Video File",
        description: validation.error,
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);

    return simulateProgressiveUpload(async () => {
      try {
        console.log("Starting video upload process for:", videoFile.name);
        
        // Upload the video file to storage
        const uploadResult = await uploadVideoToStorage(session.user.id, videoFile);
        
        if (!uploadResult.success || !uploadResult.path) {
          throw new Error(uploadResult.error || "Failed to upload video");
        }

        // Get the public URL for the uploaded file
        const publicUrl = getFullPublicUrl('shorts', uploadResult.path);
        
        if (!publicUrl) {
          throw new Error('Failed to get public URL for uploaded video');
        }
        
        const publicUrlWithCacheBuster = addCacheBuster(publicUrl);
        console.log("Public URL obtained:", publicUrlWithCacheBuster);
        
        // Create the post
        const postResult = await createPost({
          userId: session.user.id,
          title,
          description,
          videoUrl: publicUrlWithCacheBuster,
          thumbnailUrl: publicUrlWithCacheBuster, // Using same URL as thumbnail for now
          isPremium,
          tags: ['eros', 'short'],
          username,
          videoPath: uploadResult.path,
          videoFile
        });

        if (!postResult.success) {
          throw new Error(postResult.error || "Failed to create post");
        }

        toast({
          title: "Upload Successful",
          description: "Your Eros video is now live!",
        });

        return true;
      } catch (error: any) {
        console.error("Short post upload error:", error);
        
        toast({
          title: "Upload Failed",
          description: error.message || "Unable to upload your video. Please try again.",
          variant: "destructive"
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return { 
    submitShortPost, 
    isSubmitting,
    uploadProgress: uploadState.progress,
    isUploading: uploadState.isProcessing,
    isComplete: uploadState.isComplete,
    isError: uploadState.isError,
    errorMessage: uploadState.errorMessage,
    resetUploadState,
    retryUpload: () => retryUpload(() => submitShortPost({
      title: "", 
      videoFile: new File([], "")
    }))
  };
};
