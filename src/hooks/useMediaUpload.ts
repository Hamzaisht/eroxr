
import { useState } from 'react';
import { uploadFile } from '@/utils/upload/universalUpload';
import { MediaAccessLevel, UploadResult } from '@/utils/media/types';

interface UploadState {
  isUploading: boolean;
  isComplete: boolean;
  progress: number;
  error?: string;
}

interface UploadMediaOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
}

export const useMediaUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isComplete: false,
    progress: 0
  });

  const uploadMedia = async (
    file: File,
    options: UploadMediaOptions = {}
  ): Promise<UploadResult> => {
    setUploadState({
      isUploading: true,
      isComplete: false,
      progress: 0
    });

    try {
      const { contentCategory = 'media', maxSizeInMB = 100 } = options;

      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
      }

      // Simulate progress
      setUploadState(prev => ({ ...prev, progress: 25 }));

      const result = await uploadFile(file, {
        accessLevel: MediaAccessLevel.PUBLIC,
        category: contentCategory
      });

      setUploadState(prev => ({ ...prev, progress: 100 }));

      if (result.success) {
        setUploadState(prev => ({ ...prev, isComplete: true, isUploading: false }));
      } else {
        setUploadState(prev => ({ 
          ...prev, 
          isUploading: false, 
          error: result.error || 'Upload failed' 
        }));
      }

      return result;
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        isComplete: false,
        progress: 0,
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  };

  return {
    uploadMedia,
    uploadState
  };
};
