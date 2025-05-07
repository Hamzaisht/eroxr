
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // CRITICAL: Debug file info
      console.log("FILE DEBUG:", {
        file,
        isFile: file instanceof File,
        type: file?.type,
        size: file?.size,
        name: file?.name
      });
      
      // Validate file
      if (!(file instanceof File)) {
        throw new Error("Invalid file object");
      }
      
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
      
      // Generate a unique path for the upload
      const userId = session.user.id;
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop() || 'mp4';
      const path = `${userId}/${timestamp}_video.${fileExt}`;
      
      console.log(`Uploading video to path: shorts/${path} with content type: ${file.type}`);
      
      // CRITICAL: Upload directly to Supabase with explicit content type and upsert: true
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(path, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error("Video upload error:", uploadError);
        
        setUploadState({
          isUploading: false,
          progress: 0,
          isComplete: false,
          error: uploadError.message
        });
        
        return { 
          success: false, 
          error: uploadError.message 
        };
      }
      
      if (!uploadData) {
        const errorMsg = "Upload completed but no data returned";
        console.error(errorMsg);
        
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
      
      // Test upload with getPublicUrl
      const { data: { publicUrl } } = supabase.storage
        .from('shorts')
        .getPublicUrl(path);
      
      if (!publicUrl) {
        const errorMsg = "Upload completed but no URL returned";
        console.error(errorMsg);
        
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
      
      console.log("Upload successful, URL:", publicUrl);
      
      // Upload complete
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
