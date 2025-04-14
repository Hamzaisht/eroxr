
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

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
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null
      });
      
      // Start progress simulation
      let progressInterval: ReturnType<typeof setInterval>;
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
      
      // Create a unique path for the file
      const path = createUniqueFilePath(session.user.id, file);
      
      // Upload the file
      const url = await uploadFileToStorage(bucket, path, file);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      if (!url) {
        const error = "Failed to upload file";
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
      
      // Upload successful
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url
      });
      
      if (options.onSuccess) {
        options.onSuccess(url);
      }
      
      return { success: true, url, error: null };
    } catch (error: any) {
      if (typeof progressInterval !== 'undefined') {
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
