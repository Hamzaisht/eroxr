
import { useState, useEffect, useCallback } from 'react';
import { createFilePreview, revokeFilePreview, runFileDiagnostic } from '@/utils/upload/fileUtils';

export const useFilePreview = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      revokeFilePreview(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  }, [previewUrl]);

  const createPreview = useCallback((file: File): boolean => {
    clearPreview();
    setIsLoading(true);
    setError(null);

    try {
      // Verify file is valid
      runFileDiagnostic(file);
      
      if (!(file instanceof File) || file.size === 0) {
        throw new Error('Invalid file or empty file');
      }

      const url = createFilePreview(file);
      if (!url) {
        throw new Error('Failed to create preview URL');
      }

      setPreviewUrl(url);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('Error creating preview:', err);
      setError(err.message || 'Failed to create preview');
      setIsLoading(false);
      return false;
    }
  }, [clearPreview]);

  return {
    previewUrl,
    isLoading,
    error,
    createPreview,
    clearPreview
  };
};
