
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { 
  uploadFileToStorage, 
  validateMediaFile, 
  createFilePreview, 
  revokeFilePreview
} from '@/utils/mediaUtils';
import { useToast } from '@/hooks/use-toast';

export interface MediaUploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  previewUrl: string | null;
}

export const useMediaUpload = (options: MediaUploadOptions = {}) => {
  const [state, setState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    previewUrl: null
  });
  
  const session = useSession();
  const { toast } = useToast();

  const resetState = useCallback(() => {
    if (state.previewUrl) {
      revokeFilePreview(state.previewUrl);
    }
    
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      previewUrl: null
    });
  }, [state.previewUrl]);

  const validateFile = useCallback((file: File) => {
    return validateMediaFile(file, {
      maxSizeInMB: options.maxSizeInMB || 100,
      allowedTypes: options.allowedTypes
    });
  }, [options.maxSizeInMB, options.allowedTypes]);

  const uploadMedia = useCallback(async (file: File) => {
    if (!session?.user?.id) {
      const error = 'User must be authenticated to upload files';
      setState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    try {
      setState(prev => ({
        ...prev,
        isUploading: true,
        progress: 0,
        error: null,
        success: false
      }));

      // Generate preview if not already set
      if (!state.previewUrl) {
        const previewUrl = createFilePreview(file);
        setState(prev => ({ ...prev, previewUrl }));
      }

      // Simulate initial progress to provide immediate feedback
      setState(prev => ({ ...prev, progress: 5 }));
      
      // Progress simulation interval
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          const incrementAmount = Math.random() * 8 + 2; // Random increment between 2-10
          const newProgress = Math.min(prev.progress + incrementAmount, 95);
          
          if (options.onProgress) {
            options.onProgress(newProgress);
          }
          
          return { ...prev, progress: newProgress };
        });
      }, 300);

      // Upload file to storage
      const result = await uploadFileToStorage(file, session.user.id, {
        contentCategory: options.contentCategory,
        onProgress: (progress) => {
          // Only use real progress if it's higher than our simulation
          if (progress > state.progress) {
            setState(prev => ({ ...prev, progress }));
            if (options.onProgress) {
              options.onProgress(progress);
            }
          }
        }
      });

      clearInterval(progressInterval);

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        success: true,
        error: null
      }));

      // Auto-reset state if option is enabled
      if (options.autoResetOnCompletion) {
        setTimeout(() => {
          resetState();
        }, options.resetDelay || 3000);
      }

      return {
        success: true,
        url: result.url,
        path: result.path
      };
    } catch (error: any) {
      console.error('Media upload error:', error);
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: error.message || 'An unexpected error occurred during upload',
        success: false
      }));
      
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }, [session, state.previewUrl, options, resetState]);

  // Return the hook interface
  return {
    state,
    uploadMedia,
    validateFile,
    resetState,
    createPreview: (file: File) => {
      const previewUrl = createFilePreview(file);
      setState(prev => ({ ...prev, previewUrl }));
      return previewUrl;
    }
  };
};
