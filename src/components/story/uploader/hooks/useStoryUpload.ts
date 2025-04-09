
import { useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useDbService } from "@/components/home/hooks/short-post/services/useDbService";
import { supabase } from "@/integrations/supabase/client";

// Maximum file size (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface FileValidation {
  valid: boolean;
  message?: string;
}

export const useStoryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  const { checkColumnExists } = useDbService();
  const MAX_RETRIES = 1;

  const getUrlWithCacheBuster = (baseUrl: string) => {
    const timestamp = Date.now();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${timestamp}&r=${Math.random().toString(36).substring(2, 9)}`;
  };

  const validateFile = (file: File): FileValidation => {
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
    const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);

    if (!isVideo && !isImage) {
      return { 
        valid: false, 
        message: `Unsupported file type. Please upload an image (JPG, PNG, GIF, WEBP) or video (MP4, WEBM, MOV, AVI)`
      };
    }

    return { valid: true };
  };

  const uploadFile = async (file: File, filePath: string) => {
    return new Promise<{ error?: any, data?: any }>((resolve) => {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // Start the upload
      supabase.storage
        .from('stories')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Add explicit content type
        })
        .then(({ data, error }) => {
          clearInterval(progressInterval);
          resolve({ data, error });
        })
        .catch((error) => {
          clearInterval(progressInterval);
          resolve({ error });
        });
    });
  };

  const createStoryRecord = async (
    userId: string, 
    fileUrl: string, 
    isVideo: boolean, 
    contentType: string
  ) => {
    try {
      // Check for required and optional columns in stories table
      const hasContentType = await checkColumnExists('stories', 'content_type');
      const hasMediaType = await checkColumnExists('stories', 'media_type');
      const hasIsPublic = await checkColumnExists('stories', 'is_public');
      
      console.log("Column check results:", { 
        hasContentType, 
        hasMediaType, 
        hasIsPublic 
      });
      
      // Prepare the story data with required fields first
      const storyData: any = {
        creator_id: userId,
        duration: isVideo ? 30 : 10,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h from now
      };
      
      // Add content based on file type
      if (isVideo) {
        storyData.video_url = fileUrl;
      } else {
        storyData.media_url = fileUrl;
      }
      
      // Add optional fields if the columns exist
      if (hasContentType) {
        storyData.content_type = contentType;
      }
      
      if (hasMediaType) {
        storyData.media_type = contentType;
      }
      
      if (hasIsPublic) {
        storyData.is_public = true;
      }
      
      console.log("Inserting story with data:", storyData);
      
      // Insert the story record
      const { error, data } = await supabase
        .from('stories')
        .insert([storyData])
        .select();
      
      if (error) {
        console.error("Story DB insert error:", error);
        throw error;
      }
      
      return { error: null, data };
    } catch (error) {
      console.error("Error creating story record:", error);
      return { error, data: null };
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!session?.user?.id) return;
    setUploadError(null);
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // Show initial progress
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      console.log("Uploading story file:", file.type, filePath);

      // Attempt upload
      let { error: uploadError, data: uploadData } = await uploadFile(file, filePath);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Try again if we haven't reached max retries
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          toast({
            title: "Retrying upload",
            description: "First attempt failed, trying again...",
          });
          
          // Retry with a different file path
          const retryFileName = `retry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const retryFilePath = `${session.user.id}/${retryFileName}`;
          
          console.log("Retrying upload with path:", retryFilePath, "Content-Type:", file.type);
          
          const { error: retryError, data: retryData } = await supabase.storage
            .from('stories')
            .upload(retryFilePath, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: file.type // Add explicit content type
            });
          
          if (retryError) {
            console.error("Retry upload failed:", retryError);
            throw retryError;
          }
          
          console.log("Retry upload succeeded");
          uploadData = retryData;
        } else {
          throw uploadError;
        }
      }

      if (!uploadData || !uploadData.path) {
        throw new Error("Upload completed but no file path returned");
      }

      setUploadProgress(95); // Almost done

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(uploadData.path);

      if (!publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }
      
      console.log("Story public URL:", publicUrl);
      
      // Add a cache buster to ensure the URL is fresh
      const cacheBustedUrl = getUrlWithCacheBuster(publicUrl);
      
      setUploadProgress(98); // Final step
      
      // Determine if this is a video or image based on file type
      const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
      const contentType = isVideo ? 'video' : 'image';
      
      // Create story record
      const { error: storyError } = await createStoryRecord(
        session.user.id,
        cacheBustedUrl,
        isVideo,
        contentType
      );

      if (storyError) {
        console.error("Story DB insert error:", storyError);
        throw storyError;
      }

      setUploadProgress(100);
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
      
      // Instead of reloading the page, refresh stories data
      // We'll add a state update that components can listen to
      window.dispatchEvent(new CustomEvent('story-uploaded'));
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || "Failed to upload story");
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setRetryCount(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    handleFileSelect,
    validateFile
  };
};
