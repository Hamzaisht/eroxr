
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { validateFileForUpload } from "@/utils/upload/validators";
import { uploadMediaToSupabase } from "@/utils/media/uploadUtils";
import { MediaAccessLevel } from "@/utils/media/types";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const usePostMediaUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    isComplete: false
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      isComplete: false
    });
  }, []);
  
  const uploadMedia = useCallback(async (file: File): Promise<string | null> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload media",
        variant: "destructive"
      });
      return null;
    }
    
    // Validate file
    const validation = validateFileForUpload(file, 100);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error || "Please select a valid file",
        variant: "destructive"
      });
      return null;
    }
    
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      isComplete: false
    });
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 300);
      
      // Use centralized upload utility
      const result = await uploadMediaToSupabase(
        file,
        'posts',
        {
          folder: `${session.user.id}/posts`,
          maxSizeMB: 100,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }
      
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        isComplete: true
      });
      
      return result.url || null;
    } catch (error: any) {
      console.error("Media upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || "Upload failed",
        isComplete: false
      });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media",
        variant: "destructive"
      });
      
      return null;
    }
  }, [session, toast]);
  
  return {
    uploadState,
    uploadMedia,
    resetUploadState
  };
};
