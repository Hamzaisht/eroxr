
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { MediaAccessLevel, UploadOptions, UploadResult } from "./types";

/**
 * Uploads a media file to Supabase storage with optional metadata
 * 
 * @param file The file to upload
 * @param options Upload options including access level
 * @returns UploadResult with URL if successful
 */
export const uploadMediaToSupabase = async (
  file: File,
  options?: UploadOptions
): Promise<UploadResult> => {
  if (!file) {
    return {
      success: false,
      error: "No file provided"
    };
  }
  
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }
    
    // Generate a unique file path
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop() || "";
    const fileId = uuidv4();
    
    // Determine content category folder
    const contentCategory = options?.contentCategory || "media";
    
    // Build path with userId subfolder for better organization
    const filePath = `${contentCategory}/${userId}/${fileId}-${timestamp}.${fileExt}`;
    
    // Progress tracking
    let progress = 0;
    const onUploadProgress = (progressEvent: any) => {
      if (progressEvent.totalBytes) {
        progress = Math.round((progressEvent.loaded * 100) / progressEvent.totalBytes);
        options?.onProgress?.(progress);
      }
    };
    
    // Prepare metadata with creator_id and access level
    const metadata: {
      creator_id: string;
      access: MediaAccessLevel;
      post_id?: string;
    } = {
      creator_id: userId,
      access: options?.accessLevel || MediaAccessLevel.PUBLIC,
    };
    
    // Add post_id to metadata if available
    if (options?.postId) {
      metadata.post_id = options.postId;
    }
    
    // Upload file with metadata
    const { data, error } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        onUploadProgress,
        metadata
      });
    
    if (error || !data) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error?.message || "Upload failed"
      };
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(data.path);
    
    // Auto-reset progress after completion if requested
    if (options?.autoResetOnCompletion) {
      setTimeout(() => {
        options?.onProgress?.(0);
      }, options?.resetDelay || 1000);
    }
    
    return {
      success: true,
      url: publicUrlData.publicUrl,
      publicUrl: publicUrlData.publicUrl,
      path: data.path
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
