
import { useState, useEffect } from 'react';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

interface FilePreviewState {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useFilePreview = (file: File | null) => {
  const [state, setState] = useState<FilePreviewState>({
    previewUrl: null,
    isLoading: false,
    error: null
  });
  
  useEffect(() => {
    if (!file) {
      // Clear preview if file is null
      if (state.previewUrl) {
        revokeFilePreview(state.previewUrl);
      }
      
      setState({
        previewUrl: null,
        isLoading: false,
        error: null
      });
      
      return;
    }
    
    // Start loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      // Create a file preview
      const previewUrl = createFilePreview(file);
      
      setState({
        previewUrl,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error("Error creating preview:", error);
      setState({
        previewUrl: null,
        isLoading: false,
        error: error.message || "Could not create preview"
      });
    }
    
    // Cleanup the object URL when component unmounts or file changes
    return () => {
      if (state.previewUrl) {
        revokeFilePreview(state.previewUrl);
      }
    };
  }, [file]);
  
  // Method to manually clear preview
  const clearPreview = () => {
    if (state.previewUrl) {
      revokeFilePreview(state.previewUrl);
    }
    
    setState({
      previewUrl: null,
      isLoading: false,
      error: null
    });
  };
  
  return {
    ...state,
    clearPreview
  };
};

export default useFilePreview;
