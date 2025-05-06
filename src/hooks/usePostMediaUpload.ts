
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Debug file
        console.log("FILE DEBUG:", {
          file,
          isFile: file instanceof File,
          type: file?.type,
          size: file?.size,
          name: file?.name
        });
        
        // Validate file
        if (!(file instanceof File)) {
          throw new Error("Invalid file object");
        }
        
        const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/");
        if (!isValidType) {
          throw new Error(`Invalid file type: ${file.type}. Only images and videos are allowed.`);
        }
        
        // Update progress
        setState(prev => ({
          ...prev,
          progress: (i / files.length) * 100
        }));
        
        // Create unique path
        const path = createUniqueFilePath(session.user.id, file);
        
        // Upload directly to Supabase with explicit content type
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(path, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError || !uploadData) {
          throw new Error(`Failed to upload file: ${file.name} - ${uploadError?.message || 'Unknown error'}`);
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(uploadData.path);
        
        uploadedUrls.push(publicUrl);
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
