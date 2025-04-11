
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFileToStorage } from "@/utils/mediaUtils";

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
      
      // Simulate progress updates during upload
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 5, 90);
          
          if (options?.onProgress) {
            options.onProgress(newProgress);
          }
          
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 300);
      
      // Upload to Supabase storage
      const contentCategory = 'shorts';
      const result = await uploadFileToStorage(
        file,
        contentCategory,
        session.user.id
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          isComplete: false,
          error: result.error || "Upload failed"
        });
        
        return { 
          success: false, 
          error: result.error 
        };
      }
      
      if (!result.url) {
        const errorMsg = "Upload completed but no URL returned";
        setUploadState({
          isUploading: false,
          progress: 0,
          isComplete: false,
          error: errorMsg
        });
        
        return { 
          success: false, 
          error: errorMsg
        };
      }
      
      // Upload complete
      setUploadState({
        isUploading: false,
        progress: 100,
        isComplete: true,
        error: null
      });
      
      return { 
        success: true, 
        videoUrl: result.url
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
