
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { createUniqueFilePath } from '@/utils/upload/fileUtils';
import { validateFileForUpload } from '@/utils/upload/validators';

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
    
    // CRITICAL: Validate file before upload
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.message }));
      return { 
        success: false, 
        url: null, 
        mediaType: null, 
        error: validation.message || 'Invalid file' 
      };
    }
    
    // Log file debug info
    console.log("FILE DEBUG >>>", {
      name: file.name,
      size: file.size,
      type: file.type,
      isFile: file instanceof File,
      isBlob: file instanceof Blob,
      lastModified: file.lastModified,
      preview: URL.createObjectURL(file)
    });
    
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
      
      // Upload to Supabase storage with explicit content type and upsert: true
      const { data, error: uploadError } = await supabase.storage
        .from('stories')
        .upload(path, file, {
          contentType: contentType,  // CRITICAL: Set correct content type
          upsert: true,              // Allow overwrites
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error("Story upload error:", uploadError);
        throw new Error(uploadError.message);
      }
      
      if (!data || !data.path) {
        throw new Error("Supabase returned no path for uploaded story media");
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(data.path);
        
      clearInterval(progressInterval);
      
      if (!publicUrl) {
        throw new Error("Failed to get public URL for story media");
      }
      
      // Verification check - test if the URL is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn(`Upload verification failed: ${response.status} ${response.statusText}`);
        } else {
          console.log("Upload verification successful - URL is accessible");
        }
      } catch (verifyError) {
        console.warn("Could not verify uploaded file URL:", verifyError);
      }
      
      console.log("Story upload successful:", {
        publicUrl,
        mediaType,
        contentType,
        path: data.path
      });
      
      // Create story entry in database
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
      clearInterval(progressInterval!);
      
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
