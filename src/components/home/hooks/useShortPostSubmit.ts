
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

interface ShortPostSubmitParams {
  title: string;
  description?: string;
  videoFile: File;
  isPremium?: boolean;
}

export const useShortPostSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const submitShortPost = async ({
    title, 
    description, 
    videoFile,
    isPremium = false
  }: ShortPostSubmitParams) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload a short",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${session.user.id}/${uuidv4()}.${fileExt}`;
      const filePath = fileName;

      // Upload video to storage
      const { error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('shorts')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      // Insert post record
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          creator_id: session.user.id,
          content: title,
          description,
          video_urls: [publicUrl],
          video_thumbnail_url: publicUrl, // Placeholder, replace with actual thumbnail generation
          visibility: isPremium ? 'subscribers_only' : 'public',
          video_processing_status: 'completed'
        })
        .select('id')
        .single();

      if (postError) throw postError;

      toast({
        title: "Upload Successful",
        description: "Your Eros video is now live!",
      });

      return true;
    } catch (error) {
      console.error("Short post upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Unable to upload your video. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { 
    submitShortPost, 
    isSubmitting, 
    uploadProgress, 
    isUploading 
  };
};
