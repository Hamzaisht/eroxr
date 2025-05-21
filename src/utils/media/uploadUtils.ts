
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { MediaAccessLevel, UploadOptions, UploadResult } from "./types";
import { addCacheBuster } from "./mediaUtils";

interface UploadToSupabaseParams {
  file: File;
  userId: string;
  options?: {
    bucket?: string;
    maxSizeMB?: number;
    saveMetadata?: boolean;
    accessLevel?: MediaAccessLevel;
    postId?: string;
  };
}

/**
 * Uploads a media file to Supabase storage with optional metadata
 * 
 * @param params Upload parameters including file and options
 * @returns UploadResult with URL if successful
 */
export const uploadMediaToSupabase = async (
  params: UploadToSupabaseParams
): Promise<UploadResult> => {
  const { file, userId, options } = params;
  
  if (!file) {
    return {
      success: false,
      error: "No file provided"
    };
  }
  
  try {
    // Validate file
    if (!(file instanceof File) || file.size === 0) {
      console.error("Invalid file object passed to uploader:", file);
      return {
        success: false,
        error: "Invalid file provided"
      };
    }

    // Generate a unique path for the upload
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop() || "";
    const fileId = uuidv4();
    
    // Determine content category for subfolder organization
    let contentType = options?.bucket || 'media';
    if (contentType === 'media') {
      // Further organize by content type
      if (file.type.startsWith('image/')) contentType = 'images';
      else if (file.type.startsWith('video/')) contentType = 'videos';
      else if (file.type.startsWith('audio/')) contentType = 'audio';
      else contentType = 'documents';
    }
    
    // Build path with userId subfolder for better organization
    const filePath = `${userId}/${contentType}/${fileId}-${timestamp}.${fileExt}`;
    
    // Prepare metadata with creator_id and access level
    const metadata: Record<string, string> = {
      creator_id: userId,
      access: options?.accessLevel || MediaAccessLevel.PUBLIC,
    };
    
    // Add post_id to metadata if available - critical for PPV access control
    if (options?.postId) {
      metadata.post_id = options.postId;
    }
    
    console.log(`Uploading to media bucket: ${filePath} (${file.type})`);
    
    // Upload file with metadata - ALWAYS to the 'media' bucket
    const { data, error } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        metadata
      });
    
    if (error || !data) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error?.message || "Upload failed"
      };
    }
    
    // Get the appropriate URL - the bucket is now public so we use public URL
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(data.path);
      
    const accessUrl = publicUrlData?.publicUrl;
    
    if (!accessUrl) {
      return {
        success: false,
        error: "Failed to get public URL"
      };
    }
    
    // Add cache buster to ensure fresh content
    const finalUrl = addCacheBuster(accessUrl);
    
    console.log("✅ Media uploaded successfully:", finalUrl);
    
    return {
      success: true,
      url: finalUrl,
      publicUrl: finalUrl,
      path: data.path,
      accessLevel: MediaAccessLevel.PUBLIC  // Since bucket is now public
    };
  } catch (err: any) {
    console.error("Upload exception:", err);
    return {
      success: false,
      error: err.message || "Unknown error during upload"
    };
  }
};

/**
 * Delete a media file from Supabase storage
 * 
 * @param path The file path to delete
 * @returns Success status
 */
export const deleteMediaFromSupabase = async (path: string): Promise<boolean> => {
  if (!path) return false;
  
  try {
    // Extract path from full URL if needed
    let storagePath = path;
    
    // If full URL is provided, extract the path portion
    if (path.includes('storage/v1/object/public/')) {
      storagePath = path.split('storage/v1/object/public/')[1];
      // Further split to remove bucket name
      const pathParts = storagePath.split('/');
      pathParts.shift(); // Remove bucket name
      storagePath = pathParts.join('/');
    }
    
    const { error } = await supabase.storage
      .from("media")
      .remove([storagePath]);
    
    if (error) {
      console.error("Delete error:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Delete exception:", err);
    return false;
  }
};
