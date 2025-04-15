
/**
 * Comprehensive media utilities for handling URLs, types, and processing
 */

import { supabase } from "@/integrations/supabase/client";

// Export all from our specialized modules
export * from "./types";
export * from "./urlUtils";
export * from "./formatUtils";

/**
 * Infer content type from file extension
 * @param filename - The filename to check
 * @returns The MIME type for the file
 */
export function inferContentTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFileToStorage(bucket: string, path: string, file: File): Promise<string | null> {
  try {
    // Determine content type based on file extension
    const contentType = file.type || inferContentTypeFromExtension(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    // Get the public URL of the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data?.path || path);

    return publicUrl;
  } catch (error: any) {
    console.error('File upload error:', error);
    return null;
  }
}

/**
 * Create a unique file path for storage
 * @param userId - The user ID who is uploading the file
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  return `${userId}/${Date.now()}_${file.name}`;
}

/**
 * Get media URL from Supabase storage
 */
export async function getStorageUrl(path: string, bucket = 'media'): Promise<string | null> {
  if (!path) return null;
  
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Failed to get storage URL:', error);
    return null;
  }
}
