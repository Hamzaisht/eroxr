
import { useState } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useDbService } from "@/components/home/hooks/short-post/services/useDbService";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { supabase } from "@/integrations/supabase/client";
import { isVideoFile } from "@/utils/upload/validators";

export const useStoryUpload = () => {
  const session = useSession();
  const { toast } = useToast();
  const { checkColumnExists } = useDbService();
  
  // Use our new media upload system
  const {
    state: { isUploading, progress: uploadProgress, error: uploadError },
    uploadMedia,
    validateFile,
    resetState
  } = useMediaUpload({
    contentCategory: 'story',
    maxSizeInMB: 100,
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'
    ]
  });

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
      
      console.log("Column check results:", { hasContentType, hasMediaType, hasIsPublic });
      
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
    resetState();
    
    try {
      // Upload to storage using our improved upload system
      const result = await uploadMedia(file);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Upload failed");
      }
      
      // Determine if this is a video or image based on file type
      const isVideo = isVideoFile(file);
      const contentType = isVideo ? 'video' : 'image';
      
      // Create story record with the full URL
      const { error: storyError } = await createStoryRecord(
        session.user.id,
        result.url,
        isVideo,
        contentType
      );

      if (storyError) {
        throw storyError;
      }
      
      toast({
        title: "Story uploaded successfully",
        description: "Your story is now live",
      });
      
      // Refresh stories data
      window.dispatchEvent(new CustomEvent('story-uploaded'));
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive",
      });
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
