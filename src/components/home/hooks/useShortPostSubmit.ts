
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
    resetUploadState,
    retryUpload
  } = useOptimisticUpload();

  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  useEffect(() => {
    if (session?.user?.id) {
      getUsernameForWatermark(session.user.id).then(name => {
        if (name) setUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }
  }, [session?.user?.id]);

  const addCacheBuster = (url: string) => {
    if (!url) return url;
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return url.includes('?') 
      ? `${url}&t=${timestamp}&r=${random}` 
      : `${url}?t=${timestamp}&r=${random}`;
  };

  const getFullPublicUrl = (bucket: string, path: string): string => {
    if (!path) return '';
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    
    if (!data.publicUrl) {
      console.error("Failed to get public URL for", bucket, path);
      return '';
    }
    
    console.log(`Got public URL for ${bucket}/${path}:`, data.publicUrl);
    return data.publicUrl;
  };

  const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Unsupported file type. Allowed types: ${ALLOWED_VIDEO_TYPES.map(t => t.replace('video/', '')).join(', ')}`
      };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
      };
    }
    
    return { valid: true };
  };

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

    const validation = validateVideoFile(videoFile);
    if (!validation.valid) {
      toast({
        title: "Invalid Video File",
        description: validation.error,
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);

    return simulateProgressiveUpload(async () => {
      try {
        console.log("Starting video upload process for:", videoFile.name, videoFile.type, videoFile.size);
        
        const fileExt = videoFile.name.split('.').pop();
        const uniqueId = uuidv4();
        const fileName = `${session.user.id}/${uniqueId}.${fileExt}`;
        const filePath = fileName;
        const bucketName = 'shorts';

        console.log("Uploading to path:", filePath, "in bucket:", bucketName);
        console.log("File type:", videoFile.type);
        
        // First upload attempt with explicit content type
        let uploadResult = await supabase.storage
          .from(bucketName)
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: videoFile.type // Explicitly set content type
          });

        let uploadData = uploadResult.data;
        let uploadError = uploadResult.error;

        // Handle upload error with retry
        if (uploadError) {
          console.error("First upload attempt failed:", uploadError);
          
          // Add a small delay before retry
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const retryId = uuidv4();
          const retryFilePath = `${session.user.id}/retry_${retryId}.${fileExt}`;
          
          console.log("Retrying upload with path:", retryFilePath);
          console.log("Retry with content type:", videoFile.type);
          
          // Retry with slightly different options
          const retryResult = await supabase.storage
            .from(bucketName)
            .upload(retryFilePath, videoFile, {
              cacheControl: '3600',
              upsert: true,
              contentType: videoFile.type
            });
          
          uploadData = retryResult.data;
          uploadError = retryResult.error;
          
          if (uploadError) {
            console.error("Retry upload failed:", uploadError);
            throw new Error(`Upload failed after retry: ${uploadError.message}`);
          } else {
            console.log("Retry upload successful");
          }
        }
        
        if (!uploadData || !uploadData.path) {
          throw new Error('Upload completed but no file path returned');
        }
        
        console.log("Upload successful, path:", uploadData.path);
        
        // Get the public URL for the uploaded file
        const publicUrl = getFullPublicUrl(bucketName, uploadData.path);
        
        if (!publicUrl) {
          throw new Error('Failed to get public URL for uploaded video');
        }
        
        const publicUrlWithCacheBuster = addCacheBuster(publicUrl);
        console.log("Public URL obtained:", publicUrlWithCacheBuster);
        
        // Generate a thumbnail URL (using the same URL for now)
        const thumbnailUrl = publicUrlWithCacheBuster;

        // Add appropriate tags
        const tags = ['eros', 'short'];
        if (isPremium) {
          tags.push('premium');
        }
        
        console.log("Preparing post data with creator info:", username);

        // Create the post object with all required fields
        const postObject: any = {
          creator_id: session.user.id,
          content: title,
          video_urls: [publicUrlWithCacheBuster],
          video_thumbnail_url: thumbnailUrl, 
          visibility: isPremium ? 'subscribers_only' : 'public',
          video_processing_status: 'completed',
          tags: tags,
          content_type: 'video',
          is_public: true // Important for RLS policy
        };

        // Add description if provided
        if (description && description.trim() !== '') {
          postObject.content_extended = description.trim();
        }

        // Add metadata if possible
        try {
          const hasMetadataColumn = await checkColumnExists('posts', 'metadata');
          
          if (hasMetadataColumn) {
            postObject.metadata = {
              watermarkUsername: username,
              creator: session.user.id,
              uploadTimestamp: new Date().toISOString(),
              originalFilename: videoFile.name,
              publicUrl: publicUrlWithCacheBuster,
              bucketName: bucketName,
              storagePath: uploadData.path,
              fileType: videoFile.type
            };
          }
        } catch (metadataError) {
          console.warn("Couldn't check for metadata column:", metadataError);
        }

        console.log("Inserting post record:", postObject);

        // Add a small delay to ensure storage processing is complete
        await new Promise(resolve => setTimeout(resolve, 200));

        // Insert the post into the database
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .insert(postObject)
          .select('id')
          .single();

        // Handle database insert error
        if (postError) {
          console.error("Post creation error:", postError);
          
          // Try again with minimal data if the first attempt fails
          if (postError.message.includes('violates row-level security policy')) {
            console.log("Retrying insert with explicit is_public flag");
            const minimalPostObject = {
              creator_id: session.user.id,
              content: title,
              video_urls: [publicUrlWithCacheBuster],
              video_thumbnail_url: thumbnailUrl,
              is_public: true, // Explicit flag needed for RLS
              content_type: 'video',
              tags: tags
            };
            
            const { error: retryPostError } = await supabase
              .from('posts')
              .insert(minimalPostObject);
              
            if (retryPostError) {
              throw new Error(`Failed to create post after retry: ${retryPostError.message}`);
            }
          } else {
            throw new Error(`Failed to create post: ${postError.message}`);
          }
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

  const checkColumnExists = async (table: string, column: string): Promise<boolean> => {
    try {
      // Simple check by selecting from the table with the column
      const { data, error } = await supabase
        .from(table)
        .select(column)
        .limit(1);

      if (error && error.message.includes(`column "${column}" does not exist`)) {
        return false;
      }
      
      return true;
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
    resetUploadState,
    retryUpload: () => retryUpload(() => submitShortPost({
      title: "", 
      videoFile: new File([], "")
    }))
  };
};
