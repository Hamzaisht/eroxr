
import { useState, useEffect } from 'react';
import { createFilePreview, revokeFilePreview } from "@/utils/upload/fileUtils";

export const useFilePreview = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate preview from a file object
  const generatePreview = async (file: File) => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Clean up previous preview if it exists
      if (preview) {
        revokeFilePreview(preview);
      }
      
      const dataUrl = await createFilePreview(file);
      setPreview(dataUrl);
    } catch (err: any) {
      console.error('Error generating preview:', err);
      setError(err.message || 'Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear preview and revoke object URL
  const clearPreview = () => {
    if (preview) {
      revokeFilePreview(preview);
      setPreview(null);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        revokeFilePreview(preview);
      }
    };
  }, [preview]);
  
  return {
    preview,
    isLoading,
    error,
    generatePreview,
    clearPreview
  };
};
