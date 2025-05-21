
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { createUniqueFilePath } from '@/utils/upload/fileUtils';
import { uploadFileToStorage } from '@/utils/upload/storageService';

interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

interface MediaUploadOptions {
  bucket?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export const useNewMediaUpload = () => {
  const [state, setState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null
  });
  
  const session = useSession();
  
  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null
    });
  };
  
  const uploadMedia = async (file: File, options: MediaUploadOptions = {}): Promise<{
    success: boolean;
    url: string | null;
    error: string | null;
  }> => {
    if (!session?.user?.id) {
      const error = "You must be logged in to upload files";
      setState(prev => ({ ...prev, error }));
      return { success: false, url: null, error };
    }
    
    // Declare progressInterval at this level so it's accessible in both try and catch blocks
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null
      });
      
      // Start progress simulation
      progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = Math.min(prev.progress + 5, 90);
          
          if (options.onProgress) {
            options.onProgress(newProgress);
          }
          
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 300);
      
      // Get bucket name or use default
      const bucket = options.bucket || 'media';
      
      // Use createUniqueFilePath with only the file parameter
      const path = createUniqueFilePath(file);
      
      // Upload the file - this returns UploadResult, not just a URL string
      const result = await uploadFileToStorage(bucket, path, file);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      if (!result.success || !result.url) {
        const error = result.error || "Failed to upload file";
        setState({
          isUploading: false,
          progress: 0,
          error,
          url: null
        });
        
        if (options.onError) {
          options.onError(error);
        }
        
        return { success: false, url: null, error };
      }
      
      // Upload successful - extract the URL from the result
      const uploadedUrl = result.url;
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url: uploadedUrl
      });
      
      if (options.onSuccess) {
        options.onSuccess(uploadedUrl);
      }
      
      return { success: true, url: uploadedUrl, error: null };
    } catch (error: any) {
      // Clear the interval using the local progressInterval variable
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      const errorMessage = error.message || "An unknown error occurred";
      
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: null
      });
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      return { success: false, url: null, error: errorMessage };
    }
  };
  
  return {
    uploadMedia,
    reset,
    state
  };
};
