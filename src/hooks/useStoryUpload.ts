
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath, uploadFileToStorage, getContentType } from '@/utils/media/mediaUtils';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  mediaType: 'image' | 'video' | null;
}

export const useStoryUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
    mediaType: null
  });
  
  const session = useSession();
  const { toast } = useToast();
  
  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
      mediaType: null
    });
  };
  
  const uploadStory = async (file: File): Promise<{
    success: boolean;
    url: string | null;
    mediaType: 'image' | 'video' | null;
    error: string | null;
  }> => {
    // Check if user is logged in
    if (!session?.user?.id) {
      const error = "You must be logged in to upload stories";
      setState(prev => ({ ...prev, error }));
      return { 
        success: false, 
        url: null, 
        mediaType: null, 
        error 
      };
    }
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
        mediaType: null
      });
      
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 300);
      
      // Determine media type
      const fileType = file.type;
      const mediaType = fileType.startsWith('video/') ? 'video' : 'image';
      
      // Create a unique file path
      const path = createUniqueFilePath(session.user.id, file);
      
      // Upload the file to storage
      const url = await uploadFileToStorage('stories', path, file);
      
      clearInterval(progressInterval);
      
      if (!url) {
        const error = "Failed to upload story";
        setState({
          isUploading: false,
          progress: 0,
          error,
          url: null,
          mediaType: null
        });
        return { 
          success: false, 
          url: null, 
          mediaType: null, 
          error
        };
      }
      
      console.log("Story uploaded successfully, saving to database:", {
        url,
        mediaType,
        userId: session.user.id
      });
      
      // After successful upload, create story entry in database
      const storyData = {
        creator_id: session.user.id,
        media_type: mediaType,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        content_type: mediaType
      };
      
      // Set the appropriate URL field based on media type
      if (mediaType === 'video') {
        Object.assign(storyData, { video_url: url });
      } else {
        Object.assign(storyData, { media_url: url });
      }
      
      const { error: dbError } = await supabase
        .from('stories')
        .insert(storyData);
      
      if (dbError) {
        console.error("Error saving story to database:", dbError);
        setState({
          isUploading: false,
          progress: 0,
          error: dbError.message,
          url: null,
          mediaType: null
        });
        return { 
          success: false, 
          url: null, 
          mediaType: null,
          error: dbError.message
        };
      }
      
      // Success
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url,
        mediaType
      });
      
      return {
        success: true,
        url,
        mediaType,
        error: null
      };
      
    } catch (error: any) {
      console.error("Story upload error:", error);
      
      const errorMessage = error.message || "An unknown error occurred";
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
        mediaType: null
      });
      
      return { 
        success: false, 
        url: null,
        mediaType: null, 
        error: errorMessage
      };
    }
  };
  
  return {
    uploadStory,
    reset,
    state
  };
};
