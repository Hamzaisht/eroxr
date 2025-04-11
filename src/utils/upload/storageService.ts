
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueFileName, getBucketForFileType } from "./fileUtils";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  bucket?: string;
  path?: string;
  onProgress?: (progress: number) => void;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  metadata?: Record<string, string>;
}

export interface FileInfo {
  url: string;
  path: string;
  bucket: string;
  size: number;
  contentType: string;
  createdAt: Date;
}

/**
 * Uploads a file to Supabase storage
 */
export const uploadFile = async (
  file: File, 
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    // Get bucket or determine based on file type
    const bucket = options.bucket || getBucketForFileType(file.type);
    
    // Generate unique file path if not provided
    const filePath = options.path || 
      `${userId}/${options.contentType || 'media'}/${generateUniqueFileName(file.name)}`;
    
    console.log(`Uploading ${file.name} to ${bucket}/${filePath}`);
    
    const uploadOptions: Record<string, any> = {
      cacheControl: options.cacheControl || '3600',
      upsert: options.upsert ?? false,
    };
    
    // Explicitly set content type if provided
    if (options.contentType || file.type) {
      uploadOptions.contentType = options.contentType || file.type;
    }
    
    // Metadata if provided
    if (options.metadata) {
      uploadOptions.metadata = options.metadata;
    }
    
    // Upload the file to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, uploadOptions);
    
    if (error) {
      console.error("Storage upload error:", error);
      return { success: false, error: error.message };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: 'Upload completed but no file path returned' 
      };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Add timestamp to URL to prevent caching
    const cacheBustedUrl = addCacheBuster(publicUrl);
    
    console.log(`Upload successful. Public URL: ${cacheBustedUrl}`);
    
    return { 
      success: true, 
      url: cacheBustedUrl || publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return { 
      success: false, 
      error: error.message || "An unknown error occurred during upload" 
    };
  }
};

/**
 * Adds a cache busting parameter to a URL
 */
export const addCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  return `${url}${separator}t=${timestamp}&r=${random}`;
};

/**
 * Gets a public URL for a file in storage
 */
export const getPublicUrl = (bucket: string, path: string): string | null => {
  if (!path) return null;
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error("Error getting public URL:", error);
    return null;
  }
};

/**
 * Deletes a file from storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

/**
 * Lists files in a bucket/folder
 */
export const listFiles = async (
  bucket: string, 
  path: string
): Promise<FileInfo[] | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    
    if (error || !data) {
      console.error("Error listing files:", error);
      return null;
    }
    
    return data.map(item => ({
      url: getPublicUrl(bucket, `${path}/${item.name}`) || '',
      path: `${path}/${item.name}`,
      bucket,
      size: item.metadata?.size || 0,
      contentType: item.metadata?.mimetype || '',
      createdAt: new Date(item.created_at || Date.now())
    }));
  } catch (error) {
    console.error("Error listing files:", error);
    return null;
  }
};
