
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  urls: string[];
}

export const usePostMediaUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    urls: []
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const uploadMedia = async (files: File[]): Promise<{
    success: boolean;
    urls: string[];
    error: string | null;
  }> => {
    if (!session?.user?.id) {
      const error = "You must be logged in to upload media";
      setState(prev => ({ ...prev, error }));
      return { success: false, urls: [], error };
    }
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        urls: []
      });
      
      const uploadedUrls: string[] = [];
      
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        setState(prev => ({
          ...prev,
          progress: (i / files.length) * 100
        }));
        
        // Create unique path
        const path = createUniqueFilePath(session.user.id, file);
        
        // Upload to storage - this returns UploadResult, not just a URL string
        const result = await uploadFileToStorage('posts', path, file);
        
        if (!result.success || !result.url) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }
        
        uploadedUrls.push(result.url);
      }
      
      // Success
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        urls: uploadedUrls
      });
      
      return {
        success: true,
        urls: uploadedUrls,
        error: null
      };
      
    } catch (error: any) {
      console.error("Media upload error:", error);
      
      const errorMessage = error.message || "An unknown error occurred";
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        urls: []
      });
      
      return {
        success: false,
        urls: [],
        error: errorMessage
      };
    }
  };
  
  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      urls: []
    });
  };
  
  return {
    uploadMedia,
    reset,
    state
  };
};
