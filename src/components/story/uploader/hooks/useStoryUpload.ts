
import { useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useDbService } from "@/components/home/hooks/short-post/services/useDbService";
import { uploadFileToStorage, getUrlWithCacheBuster } from "@/utils/mediaUtils";

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

  // Single validateFile function definition
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
      
      // Add content based on file type - use the full URL directly
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
      
      // File validation
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.message || "Invalid file");
      }
      
      // Track progress during upload
      const onProgress = (progress: number) => {
        setUploadProgress(progress);
      };

      // Upload to Supabase storage
      const result = await uploadFileToStorage(file, 'stories', session.user.id);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      if (!result.url) {
        throw new Error("Upload completed but no URL returned");
      }
      
      setUploadProgress(95); // Almost done
      
      // Determine if this is a video or image based on file type
      const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);
      const contentType = isVideo ? 'video' : 'image';
      
      // Create story record with the URL
      const { error: storyError } = await createStoryRecord(
        session.user.id,
        result.url,
        isVideo,
        contentType
      );

      if (storyError) {
        throw storyError;
      }

      setUploadProgress(100);
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
      
      // Refresh stories data
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
