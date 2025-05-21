import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';
import { MediaAccessLevel } from '@/utils/media/types';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const useStoryUpload = () => {
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
  
  const uploadStory = useCallback(async (file: File): Promise<string | null> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload stories",
        variant: "destructive"
      });
      return null;
    }
    
    // Validate file
    runFileDiagnostic(file);
    
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
        'stories',
        {
          maxSizeMB: 50,
          folder: `${session.user.id}/stories`,
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
      console.error("Story upload error:", error);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || "Upload failed",
        isComplete: false
      });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload story",
        variant: "destructive"
      });
      
      return null;
    }
  }, [session, toast]);
  
  return {
    uploadState,
    uploadStory,
    resetUploadState
  };
};
