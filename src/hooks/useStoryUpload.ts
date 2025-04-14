
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { getContentType, createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';
import { debugMediaUrl } from '@/utils/media/debugMediaUtils';

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
    
    // Determine media type early
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    let progressInterval: ReturnType<typeof setInterval>;
    
    try {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
        mediaType
      });
      
      progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 300);
      
      // Create a unique file path and upload
      const path = createUniqueFilePath(session.user.id, file);
      const url = await uploadFileToStorage('stories', path, file);
      
      clearInterval(progressInterval);
      
      if (!url) {
        throw new Error("Failed to upload story media");
      }
      
      console.log("Story upload successful:", {
        url,
        mediaType,
        contentType: file.type
      });
      
      // Debug URL after upload
      await debugMediaUrl(url);
      
      // Create story entry in database
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_type: mediaType,
          content_type: mediaType,
          [mediaType === 'video' ? 'video_url' : 'media_url']: url,
          is_active: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        url,
        mediaType
      });
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live"
      });
      
      return {
        success: true,
        url,
        mediaType,
        error: null
      };
    } catch (error: any) {
      clearInterval(progressInterval);
      
      const errorMessage = error.message || "An unknown error occurred";
      console.error("Story upload error:", error);
      
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        url: null,
        mediaType: null
      });
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
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
