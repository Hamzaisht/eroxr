
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useVideoUpload } from "./useVideoUpload";

interface ShortPostData {
  title: string;
  description?: string;
  videoFile: File;
  tags?: string[];
}

export const useShortPostSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { uploadVideo, uploadState } = useVideoUpload();
  const queryClient = useQueryClient();

  const getVideoDuration = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const submitShortPost = async (data: ShortPostData): Promise<boolean> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload shorts",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Upload the video file
      const { success, videoUrl, error } = await uploadVideo(data.videoFile);
      
      if (!success || !videoUrl) {
        throw new Error(error || "Failed to upload video");
      }

      // 2. Get video duration
      const duration = await getVideoDuration(data.videoFile);
      
      // 3. Create post record
      const { error: postError } = await supabase
        .from('posts')
        .insert([
          {
            creator_id: session.user.id,
            content: data.title,
            description: data.description || null,
            video_urls: [videoUrl],
            visibility: 'public',
            tags: data.tags || ['eros', 'short'],
            video_duration: Math.round(duration) || 30
          },
        ]);

      if (postError) {
        throw postError;
      }

      // 4. Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Upload successful",
        description: "Your short has been uploaded successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error('Short post submission error:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload your short. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitShortPost,
    isSubmitting,
    uploadProgress: uploadState.progress,
    isUploading: uploadState.isUploading
  };
};
