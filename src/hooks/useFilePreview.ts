
import { useState, useCallback, useEffect } from 'react';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

export const useFilePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Create preview for a file
  const createPreview = useCallback((file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clean up previous preview if exists
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
      
      // Create new preview URL
      const url = createFilePreview(file);
      setPreviewUrl(url);
      
      return url;
    } catch (error: any) {
      console.error("Error creating file preview:", error);
      setError(error.message || "Failed to create preview");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [previewUrl]);
  
  // Clear preview
  const clearPreview = useCallback(() => {
    if (previewUrl) {
      revokeFilePreview(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  }, [previewUrl]);
  
  return {
    previewUrl,
    isLoading,
    error,
    createPreview,
    clearPreview
  };
};
