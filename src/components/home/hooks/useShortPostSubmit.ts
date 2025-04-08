
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

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
  const [username, setUsername] = useState<string>('eroxr');
  const { toast } = useToast();
  const session = useSession();

  // Fetch username when the component mounts
  useEffect(() => {
    if (session?.user?.id) {
      getUsernameForWatermark(session.user.id).then(name => {
        setUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }
  }, [session?.user?.id]);

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

      // For video files, we'll use a CSS overlay watermark approach
      // because re-encoding videos on the client is resource intensive
      
      // Upload video to storage
      const { error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('shorts').getPublicUrl(filePath);
      
      if (!data.publicUrl) throw new Error('Failed to get public URL');

      // Add tags for premium content
      const tags = ['eros', 'short'];
      if (isPremium) {
        tags.push('premium');
      }

      // Store the username for watermarking
      const metadata = {
        watermarkUsername: username,
        creator: session.user.id
      };

      // Create the base post object without the optional description field
      const postObject: any = {
        creator_id: session.user.id,
        content: title,
        video_urls: [data.publicUrl],
        video_thumbnail_url: data.publicUrl, 
        visibility: isPremium ? 'subscribers_only' : 'public',
        video_processing_status: 'completed',
        tags: tags,
        metadata: metadata
      };

      // Only add the description field if it exists and is not empty
      if (description && description.trim() !== '') {
        // Check if we need to store it in a different field name
        // Use content_extended as fallback if description column doesn't exist
        postObject.content_extended = description;
      }

      // Insert post record
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert(postObject)
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

