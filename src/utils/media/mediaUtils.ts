
import { MediaType, MediaSource } from './types';
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a unique file path for uploads
 * @param userId User ID for the upload
 * @param file File to upload
 * @returns A unique path string
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop();
  return `${userId}/${timestamp}-${randomString}.${fileExt}`;
};

/**
 * Determines the type of media from a source
 * @param source Media source object or URL string
 * @returns Media type (image, video, etc.)
 */
export const determineMediaType = (source: MediaSource | string): MediaType => {
  // If source is a string (direct URL)
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    if (url.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/)) {
      return MediaType.IMAGE;
    } else if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)) {
      return MediaType.VIDEO;
    } else if (url.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/)) {
      return MediaType.AUDIO;
    }
    // Try to infer from URL parameters
    if (url.includes('video') || url.includes('mp4')) {
      return MediaType.VIDEO;
    }
    if (url.includes('image')) {
      return MediaType.IMAGE;
    }
    return MediaType.UNKNOWN;
  }
  
  // If source is an object, check its properties
  if (source.media_type) {
    if (source.media_type.includes('image')) return MediaType.IMAGE;
    if (source.media_type.includes('video')) return MediaType.VIDEO;
    if (source.media_type.includes('audio')) return MediaType.AUDIO;
  }
  
  if (source.content_type) {
    if (source.content_type.includes('image')) return MediaType.IMAGE;
    if (source.content_type.includes('video')) return MediaType.VIDEO;
    if (source.content_type.includes('audio')) return MediaType.AUDIO;
  }
  
  // Check if specific URLs exist
  if (source.video_url || (source.video_urls && source.video_urls.length > 0)) {
    return MediaType.VIDEO;
  }
  
  if (source.image_url) {
    return MediaType.IMAGE;
  }
  
  if (source.media_url) {
    // Try to infer from media_url extension
    const url = source.media_url.toLowerCase();
    if (url.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)(\?.*)?$/)) {
      return MediaType.IMAGE;
    } else if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)) {
      return MediaType.VIDEO;
    }
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extracts a media URL from various source formats
 * @param source Media source object or URL string
 * @returns Extracted URL string
 */
export const extractMediaUrl = (source: MediaSource | string): string => {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  const extractedUrl = source.video_url || 
    (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
    source.media_url || 
    (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
    source.image_url ||
    source.url || 
    source.src || 
    '';
    
  return extractedUrl;
};

/**
 * Get content type of a file
 * @param file File object
 * @returns Content type string
 */
export const getContentType = (file: File): string => {
  return file.type || inferContentTypeFromExtension(file.name);
};

/**
 * Upload a file to Supabase storage
 * @param bucket Bucket name
 * @param path File path
 * @param file File to upload
 * @param options Optional upload options
 * @returns Upload result
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    contentType?: string;
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}> => {
  try {
    const contentType = options?.contentType || file.type || inferContentTypeFromExtension(file.name);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert ?? false
      });
      
    if (error) {
      console.error("Storage upload error:", error);
      return { 
        success: false, 
        error: error.message || "Upload failed"
      };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: "Upload succeeded but no path returned"
      };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    // Return result
    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
};

/**
 * Infers content type based on file extension
 * @param filename Filename with extension
 * @returns Content type string
 */
export const inferContentTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: {[key: string]: string} = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};
