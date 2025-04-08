
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
    setUploadProgress(10);

    try {
      console.log("Starting video upload process...");
      
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${session.user.id}/${uuidv4()}.${fileExt}`;
      const filePath = fileName;

      console.log("Uploading to path:", filePath);
      
      setUploadProgress(20);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shorts')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: videoFile.type
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      console.log("Upload successful:", uploadData);
      setUploadProgress(70);

      const { data } = supabase.storage.from('shorts').getPublicUrl(filePath);
      
      if (!data.publicUrl) {
        throw new Error('Failed to get public URL for uploaded video');
      }
      
      console.log("Public URL obtained:", data.publicUrl);
      setUploadProgress(80);

      const tags = ['eros', 'short'];
      if (isPremium) {
        tags.push('premium');
      }

      // Create watermark and creator info without using a metadata column
      const creatorInfo = username || 'eroxr';
      
      console.log("Preparing post data with creator info:", creatorInfo);
      setUploadProgress(90);

      const postObject: any = {
        creator_id: session.user.id,
        content: title,
        video_urls: [data.publicUrl],
        video_thumbnail_url: data.publicUrl, 
        visibility: isPremium ? 'subscribers_only' : 'public',
        video_processing_status: 'completed',
        tags: tags
      };

      // Try to store metadata if the column exists, but don't fail if it doesn't
      try {
        // First check if posts table has a metadata column
        const { data: tableInfo, error: tableError } = await supabase
          .from('posts')
          .select('*')
          .limit(1);
          
        // If we got data back, check if the column exists
        if (!tableError && tableInfo) {
          console.log("Checking for metadata column in schema");
          const hasMetadataColumn = await checkColumnExists('posts', 'metadata');
          
          if (hasMetadataColumn) {
            console.log("Metadata column exists, adding to post object");
            postObject.metadata = {
              watermarkUsername: username,
              creator: session.user.id
            };
          } else {
            console.log("Metadata column doesn't exist, skipping");
          }
        }
      } catch (metadataError) {
        // Just log this but don't fail the upload
        console.warn("Couldn't check for metadata column:", metadataError);
      }

      if (description && description.trim() !== '') {
        postObject.content_extended = description.trim();
        console.log("Added description to content_extended:", description.trim());
      } else {
        console.log("No description provided, skipping content_extended field");
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
      setUploadProgress(100);

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
      setIsUploading(false);
      setUploadProgress(0);
    }
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
    uploadProgress, 
    isUploading 
  };
};
