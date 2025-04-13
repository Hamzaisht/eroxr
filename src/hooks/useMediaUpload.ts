
import { useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { uploadFileToStorage, UploadResult, UploadOptions } from '@/utils/mediaUtils';
import { validateMediaFile } from '@/utils/mediaUtils';

export interface MediaUploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
}

export const useMediaUpload = (options: MediaUploadOptions = {}) => {
  const [state, setState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    isComplete: false
  });
  
  const session = useSession();
  
  // Reset upload state
  const resetUploadState = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      isComplete: false
    });
  }, []);
  
  // Validate file
  const validateFile = useCallback((file: File) => {
    return validateMediaFile(file, {
      maxSizeInMB: options.maxSizeInMB,
      allowedTypes: options.allowedTypes
    });
  }, [options.maxSizeInMB, options.allowedTypes]);
  
  // Upload media file
  const uploadMedia = useCallback(async (file: File): Promise<UploadResult> => {
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setState(prev => ({
        ...prev,
        error: validation.message || 'Invalid file'
      }));
      
      return {
        success: false,
        error: validation.message || 'Invalid file'
      };
    }
    
    // Start upload
    setState({
      isUploading: true,
      progress: 0,
      error: null,
      isComplete: false
    });
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 200);
      
      // Create upload options
      const uploadOptions: UploadOptions = {
        contentCategory: options.contentCategory || 'generic'
      };
      
      // Upload file
      const result = await uploadFileToStorage(
        file,
        session.user.id,
        uploadOptions
      );
      
      clearInterval(progressInterval);
      
      if (!result.success) {
        setState({
          isUploading: false,
          progress: 0,
          error: result.error || 'Upload failed',
          isComplete: false
        });
        
        return result;
      }
      
      // Upload completed successfully
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        isComplete: true
      });
      
      // Auto reset if enabled
      if (options.autoResetOnCompletion) {
        setTimeout(() => {
          resetUploadState();
        }, options.resetDelay || 3000);
      }
      
      return result;
    } catch (error: any) {
      setState({
        isUploading: false,
        progress: 0,
        error: error.message || 'Upload failed',
        isComplete: false
      });
      
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }, [session, options.contentCategory, options.autoResetOnCompletion, options.resetDelay, validateFile, resetUploadState]);
  
  return {
    state,
    uploadMedia,
    validateFile,
    resetUploadState
  };
};
