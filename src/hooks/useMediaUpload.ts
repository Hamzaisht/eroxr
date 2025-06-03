
import { useState } from 'react';
import { uploadMediaToSupabase, uploadMultipleMedia, UploadOptions, UploadResult } from '@/utils/upload/supabaseUpload';

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const upload = async (file: File, options: UploadOptions = {}): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setIsComplete(false);

    try {
      const result = await uploadMediaToSupabase(file, options);
      
      if (!result.success) {
        setUploadError(result.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      setIsComplete(true);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      setUploadError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultiple = async (files: File[], options: UploadOptions = {}): Promise<UploadResult[]> => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setIsComplete(false);

    try {
      const results = await uploadMultipleMedia(files, options);
      
      const failedUploads = results.filter(r => !r.success);
      if (failedUploads.length > 0) {
        setUploadError(`${failedUploads.length} uploads failed`);
      }
      
      setUploadProgress(100);
      setIsComplete(true);
      return results;
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      setUploadError(errorMessage);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  // Add aliases for backward compatibility
  const uploadMedia = upload;
  const uploadState = {
    isUploading,
    progress: uploadProgress,
    error: uploadError,
    isComplete
  };

  return {
    upload,
    uploadMultiple,
    uploadMedia, // Alias for backward compatibility
    uploadState, // State object for backward compatibility
    isUploading,
    uploadProgress,
    uploadError
  };
};
