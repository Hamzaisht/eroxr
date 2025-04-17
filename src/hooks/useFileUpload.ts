
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/utils/upload/fileUploadService";

interface UploadState {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
  error: string | null;
}

interface UploadFileOptions {
  bucket: string;
  contentType?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    isComplete: false,
    error: null
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const uploadFileToStorage = useCallback(async (
    file: File, 
    options: UploadFileOptions
  ) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files",
        variant: "destructive",
      });
      return { success: false, error: "Not authenticated" };
    }
    
    setUploadState(prev => ({ ...prev, isUploading: true, progress: 0, error: null }));

    try {
      // Create progress simulation
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 8, 90);
          
          if (options?.onProgress) {
            options.onProgress(newProgress);
          }
          
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 300);
      
      // Upload the file using our utility function
      const result = await uploadFile(
        file, 
        options.bucket, 
        session.user.id,
        {
          contentType: options.contentType,
          upsert: options.upsert,
          onProgress: options.onProgress
        }
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          isComplete: false,
          error: result.error || "Upload failed"
        });
        return result;
      }
      
      // Upload complete
      setUploadState({
        isUploading: false,
        progress: 100,
        isComplete: true,
        error: null
      });
      
      return result;
    } catch (error: any) {
      console.error("File upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        isComplete: false,
        error: error.message || "Upload failed"
      });
      
      return { 
        success: false, 
        error: error.message || "An unknown error occurred"
      };
    }
  }, [session, toast]);
  
  const resetUploadState = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      isComplete: false,
      error: null
    });
  };
  
  return {
    uploadState,
    uploadFileToStorage,
    resetUploadState
  };
};
