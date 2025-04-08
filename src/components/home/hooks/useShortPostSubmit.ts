
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { useOptimisticUpload } from "@/hooks/useOptimisticUpload";

interface ShortPostSubmitParams {
  title: string;
  description?: string;
  videoFile: File;
  isPremium?: boolean;
}

export const useShortPostSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState<string>('eroxr');
  const { toast } = useToast();
  const session = useSession();
  const { 
    uploadState, 
    simulateProgressiveUpload,
    resetUploadState 
  } = useOptimisticUpload();

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

    return simulateProgressiveUpload(async () => {
      try {
        console.log("Starting video upload process...");
        
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${session.user.id}/${uuidv4()}.${fileExt}`;
        const filePath = fileName;

        console.log("Uploading to path:", filePath);
        
        // Check if we need to compress the video before upload
        let fileToUpload = videoFile;
        if (videoFile.size > 50 * 1024 * 1024) {
          // For simplicity, we're not actually implementing compression
          // But this is where you would compress the video
          console.log("Video is large, compression would happen here");
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shorts')
          .upload(filePath, fileToUpload, {
            cacheControl: '3600',
            upsert: true,
            contentType: videoFile.type
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        console.log("Upload successful:", uploadData);

        const { data } = supabase.storage.from('shorts').getPublicUrl(filePath);
        
        if (!data.publicUrl) {
          throw new Error('Failed to get public URL for uploaded video');
        }
        
        console.log("Public URL obtained:", data.publicUrl);

        const tags = ['eros', 'short'];
        if (isPremium) {
          tags.push('premium');
        }
        
        console.log("Preparing post data with creator info:", username);

        const postObject: any = {
          creator_id: session.user.id,
          content: title,
          video_urls: [data.publicUrl],
          video_thumbnail_url: data.publicUrl, 
          visibility: isPremium ? 'subscribers_only' : 'public',
          video_processing_status: 'completed',
          tags: tags
        };

        // Add description if provided
        if (description && description.trim() !== '') {
          postObject.content_extended = description.trim();
          console.log("Added description to content_extended:", description.trim());
        }

        // Try to store metadata if the column exists
        try {
          const hasMetadataColumn = await checkColumnExists('posts', 'metadata');
          
          if (hasMetadataColumn) {
            console.log("Metadata column exists, adding to post object");
            postObject.metadata = {
              watermarkUsername: username,
              creator: session.user.id,
              uploadTimestamp: new Date().toISOString(),
              originalFilename: videoFile.name
            };
          } else {
            console.log("Metadata column doesn't exist, skipping");
          }
        } catch (metadataError) {
          // Just log this but don't fail the upload
          console.warn("Couldn't check for metadata column:", metadataError);
        }

        console.log("Inserting post record:", postObject);

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .insert(postObject)
          .select('id')
          .single();

        if (postError) {
          console.error("Post creation error:", postError);
          throw new Error(`Failed to create post: ${postError.message}`);
        }

        console.log("Post created successfully:", postData);

        toast({
          title: "Upload Successful",
          description: "Your Eros video is now live!",
        });

        return true;
      } catch (error: any) {
        console.error("Short post upload error:", error);
        
        toast({
          title: "Upload Failed",
          description: error.message || "Unable to upload your video. Please try again.",
          variant: "destructive"
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // Helper function to check if a column exists in a table
  const checkColumnExists = async (table: string, column: string): Promise<boolean> => {
    try {
      // Use system tables to check if column exists
      const { data, error } = await supabase
        .rpc('check_column_exists', { 
          p_table_name: table,
          p_column_name: column
        });

      if (error) {
        console.warn(`Error checking if column ${column} exists:`, error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.warn(`Error in checkColumnExists for ${column}:`, err);
      return false;
    }
  };

  return { 
    submitShortPost, 
    isSubmitting,
    uploadProgress: uploadState.progress,
    isUploading: uploadState.isProcessing,
    isComplete: uploadState.isComplete,
    isError: uploadState.isError,
    errorMessage: uploadState.errorMessage,
    resetUploadState
  };
};
