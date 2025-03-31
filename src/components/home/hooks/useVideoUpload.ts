
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface UploadState {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
  error: string | null;
}

interface UploadResult {
  success: boolean;
  videoUrl?: string;
  error?: string;
}

export const useVideoUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    isComplete: false,
    error: null
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      isComplete: false,
      error: null
    });
  };

  const uploadVideo = async (
    file: File,
    options?: { 
      onProgress?: (progress: number) => void
    }
  ): Promise<UploadResult> => {
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: "You must be logged in to upload videos"
      };
    }

    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        isComplete: false,
        error: null
      });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const onProgress = (progress: { loaded: number; total: number }) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setUploadState(prev => ({ ...prev, progress: percent }));
        if (options?.onProgress) {
          options.onProgress(percent);
        }
      };

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('shorts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: onProgress
        });

      if (error) {
        console.error("Storage upload error:", error);
        setUploadState(prev => ({ 
          ...prev, 
          isUploading: false, 
          error: error.message
        }));
        return { 
          success: false, 
          error: error.message
        };
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);

      setUploadState({
        isUploading: false,
        progress: 100,
        isComplete: true,
        error: null
      });

      return { 
        success: true, 
        videoUrl: publicUrl
      };
    } catch (error: any) {
      console.error("Video upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        isComplete: false,
        error: error.message || "Failed to upload video"
      });
      
      return { 
        success: false, 
        error: error.message || "Failed to upload video"
      };
    }
  };

  return {
    uploadState,
    uploadVideo,
    resetUploadState
  };
};
