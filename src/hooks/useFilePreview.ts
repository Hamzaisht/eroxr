
import { useState, useEffect, useCallback } from 'react';
import { createFilePreview, revokeFilePreview } from '@/utils/upload/fileUtils';

interface FilePreviewState {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useFilePreview = (file?: File | null) => {
  const [state, setState] = useState<FilePreviewState>({
    previewUrl: null,
    isLoading: false,
    error: null
  });
  
  useEffect(() => {
    if (!file) {
      return;
    }
    
    // Start loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      console.log(`Creating preview for file: ${file.name} (${file.type}, ${file.size} bytes)`);
      
      // Create a file preview
      const previewUrl = createFilePreview(file);
      console.log(`Preview URL created: ${previewUrl?.substring(0, 30)}...`);
      
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
        console.log(`Revoking preview URL: ${state.previewUrl.substring(0, 30)}...`);
        revokeFilePreview(state.previewUrl);
      }
    };
  }, [file]);
  
  // Method to manually clear preview
  const clearPreview = useCallback(() => {
    if (state.previewUrl) {
      console.log(`Manually clearing preview: ${state.previewUrl.substring(0, 30)}...`);
      revokeFilePreview(state.previewUrl);
    }
    
    setState({
      previewUrl: null,
      isLoading: false,
      error: null
    });
  }, [state.previewUrl]);
  
  // Method to create preview for a specific file
  const createPreview = useCallback((fileToPreview: File) => {
    if (state.previewUrl) {
      console.log(`Clearing old preview before creating new one`);
      revokeFilePreview(state.previewUrl);
    }
    
    try {
      console.log(`Creating preview for file: ${fileToPreview.name}, type: ${fileToPreview.type}, size: ${fileToPreview.size}`);
      const previewUrl = createFilePreview(fileToPreview);
      console.log(`New preview URL created: ${previewUrl?.substring(0, 30)}...`);
      
      setState({
        previewUrl,
        isLoading: false,
        error: null
      });
      return previewUrl;
    } catch (error: any) {
      console.error("Error creating preview:", error);
      setState({
        previewUrl: null,
        isLoading: false,
        error: error.message || "Could not create preview"
      });
      return null;
    }
  }, [state.previewUrl]);
  
  return {
    ...state,
    clearPreview,
    createPreview
  };
};

export default useFilePreview;
