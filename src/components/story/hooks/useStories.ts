
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createUniqueFilePath } from '@/utils/media/mediaUtils';

export const useStories = () => {
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const uploadStory = async (file: File, duration?: number): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload stories",
        variant: "destructive"
      });
      return { success: false, error: "Not authenticated" };
    }

    if (!file) {
      return { success: false, error: "No file selected" };
    }

    setIsUploading(true);

    try {
      // Determine content type
      let contentType = "image";
      if (file.type.startsWith("video/")) {
        contentType = "video";
      }

      // Create a unique path for the upload
      const userId = session.user.id;
      const filePath = createUniqueFilePath(userId, file);

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("stories")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("stories")
        .getPublicUrl(data.path);

      // Create a story record in the database
      const { error: storyError } = await supabase.from("stories").insert({
        creator_id: userId,
        media_url: urlData.publicUrl,
        content_type: contentType,
        duration: duration || (contentType === "video" ? null : 5),
        media_type: file.type
      });

      if (storyError) {
        throw storyError;
      }

      return {
        success: true,
        url: urlData.publicUrl
      };
    } catch (error: any) {
      console.error("Story upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload story"
      };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadStory,
    isUploading
  };
};
