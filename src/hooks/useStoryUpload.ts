
import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateFileForUpload } from "@/utils/upload/validators";
import { createFilePreview, revokeFilePreview } from "@/utils/upload/fileUtils";
import { uploadMediaToSupabase } from "@/utils/media/uploadUtils";
import { MediaAccessLevel } from "@/utils/media/types";

export const useStoryUpload = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    
    // Validate file
    const validation = validateFileForUpload(file, 50);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error || "Please select a valid media file",
        variant: "destructive"
      });
      return;
    }
    
    // Create preview
    try {
      const preview = await createFilePreview(file);
      setMediaFile(file);
      setMediaPreview(preview);
    } catch (err) {
      console.error("Error creating preview:", err);
    }
  };

  const uploadStory = async (): Promise<string | null> => {
    if (!mediaFile || !session?.user?.id) {
      toast({
        title: "Upload error",
        description: "No file selected or not logged in",
        variant: "destructive"
      });
      return null;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Upload using the centralized utility
      const result = await uploadMediaToSupabase({
        file: mediaFile,
        userId: session.user.id,
        options: {
          bucket: 'media',
          maxSizeMB: 50,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      });
      
      setUploadProgress(100);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to upload story");
      }
      
      return result.url;
    } catch (error: any) {
      console.error("Story upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload story",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const publishStory = async (): Promise<boolean> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to publish your story",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const mediaUrl = await uploadStory();
      
      if (!mediaUrl) {
        throw new Error("Failed to upload media");
      }
      
      // Determine content type from file
      const contentType = mediaFile?.type.startsWith('image/') ? 'image' : 'video';
      
      // Insert into stories table
      const { error } = await supabase
        .from("stories")
        .insert({
          creator_id: session.user.id,
          media_url: mediaUrl,
          content_type: contentType,
          is_public: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });
      
      if (error) throw error;
      
      toast({
        title: "Story Published",
        description: "Your story has been published successfully"
      });
      
      // Reset form
      resetForm();
      return true;
    } catch (error: any) {
      console.error("Story submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to publish story",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMediaFile(null);
    if (mediaPreview) {
      revokeFilePreview(mediaPreview);
    }
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        revokeFilePreview(mediaPreview);
      }
    };
  }, [mediaPreview]);

  return {
    mediaFile,
    mediaPreview,
    isUploading,
    isSubmitting,
    uploadProgress,
    fileInputRef,
    handleFileChange,
    uploadStory,
    publishStory,
    resetForm
  };
};
