
import { useState, useEffect } from 'react';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

interface FilePreviewState {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for generating and managing file previews
 */
export const useFilePreview = (file: File | null) => {
  const [state, setState] = useState<FilePreviewState>({
    previewUrl: null,
    isLoading: false,
    error: null
  });
  
  // Generate preview when file changes
  useEffect(() => {
    if (!file) {
      // Clean up any existing preview
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
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      // Create preview URL
      const url = createFilePreview(file);
      
      setState({
        previewUrl: url,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      setState({
        previewUrl: null,
        isLoading: false,
        error: error.message || "Failed to generate preview"
      });
    }
    
    // Clean up when unmounted or file changes
    return () => {
      if (state.previewUrl) {
        revokeFilePreview(state.previewUrl);
      }
    };
  }, [file]);
  
  // Method to clear preview manually
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
