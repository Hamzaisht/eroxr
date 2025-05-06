
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from '@/utils/media/mediaUtils';

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
    
    // Validate and debug file
    console.log("FILE DEBUG:", {
      file,
      isFile: file instanceof File,
      type: file?.type,
      size: file?.size,
      name: file?.name
    });
    
    if (!(file instanceof File)) {
      const error = "Invalid file object";
      setState(prev => ({ ...prev, error }));
      return { 
        success: false, 
        url: null, 
        mediaType: null, 
        error 
      };
    }
    
    // Determine media type based on file mime type
    const contentType = file.type;
    let mediaType: 'image' | 'video' | null = null;
    
    if (contentType.startsWith('image/')) {
      mediaType = 'image';
    } else if (contentType.startsWith('video/')) {
      mediaType = 'video';
    } else {
      const error = `Invalid file type: ${contentType}. Only images and videos are allowed.`;
      setState(prev => ({ ...prev, error }));
      return { 
        success: false, 
        url: null, 
        mediaType: null, 
        error 
      };
    }
    
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
      
      // Create unique storage path for the file
      const path = createUniqueFilePath(session.user.id, file);
      
      console.log(`Uploading ${mediaType} story with content type: ${contentType}`);
      
      // Upload to Supabase storage with explicit content type
      const { data, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(path, file, {
          contentType: contentType,
          upsert: true,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(data.path);
        
      clearInterval(progressInterval);
      
      if (!publicUrl) {
        throw new Error("Failed to get public URL for story media");
      }
      
      console.log("Story upload successful:", {
        publicUrl,
        mediaType,
        contentType,
        path: data.path
      });
      
      // Create story entry in database with improved field handling
      const { error: dbError } = await supabase
        .from('stories')
        .insert({
          creator_id: session.user.id,
          media_type: mediaType,
          content_type: mediaType,
          media_url: mediaType === 'image' ? publicUrl : null,
          video_url: mediaType === 'video' ? publicUrl : null,
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
        url: publicUrl,
        mediaType
      });
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live"
      });
      
      return {
        success: true,
        url: publicUrl,
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
