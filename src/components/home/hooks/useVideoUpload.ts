
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { uploadMediaToSupabase } from "@/utils/media/uploadUtils";
import { runFileDiagnostic } from "@/utils/upload/fileUtils";
import { MediaAccessLevel } from "@/utils/media/types";

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

    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation before upload
    if (!file || !(file instanceof File) || file.size === 0) {
      const errorMessage = "Only raw File instances with data can be uploaded";
      console.error("❌ Invalid File passed to uploader", file);
      
      setUploadState(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      return { 
        success: false, 
        error: errorMessage
      };
    }

    try {
      // Validate file type
      const isValidVideoType = file.type.startsWith("video/");
      if (!isValidVideoType) {
        throw new Error(`Invalid file type: ${file.type}. Only videos are allowed.`);
      }
      
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
      
      // Use the centralized upload utility
      const result = await uploadMediaToSupabase(
        file,
        'media',
        {
          maxSizeMB: 100,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
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
