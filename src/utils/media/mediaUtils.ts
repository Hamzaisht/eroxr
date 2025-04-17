
import { nanoid } from 'nanoid';
import { supabase } from "@/integrations/supabase/client";
import { MediaType, MediaSource } from './types';

/**
 * Creates a unique file path for storage
 * 
 * @param userId User ID to include in the path
 * @param file File to create path for
 * @returns Unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uniqueId = nanoid(8);
  const fileExtension = getFileExtension(file.name);
  
  return `${userId}/${timestamp}-${uniqueId}.${fileExtension}`;
};

/**
 * Gets the file extension from a filename
 * 
 * @param filename Filename to get extension from
 * @returns File extension without the dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Uploads a file to Supabase storage
 * 
 * @param bucket Bucket name
 * @param path File path
 * @param file File to upload
 * @param options Upload options
 * @returns Upload result
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const contentType = options?.contentType || file.type;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: options?.upsert ?? false,
        cacheControl: '3600'
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
      
    return {
      success: true,
      url: urlData.publicUrl
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
 * Determines the media type from a file or URL
 * 
 * @param source Media source (string URL or object)
 * @returns Media type (image, video, etc.)
 */
export const determineMediaType = (source: MediaSource | string): MediaType => {
  // If it's a string URL
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    
    if (url.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)($|\?)/i)) {
      return MediaType.IMAGE;
    }
    
    if (url.match(/\.(mp4|webm|ogg|mov|avi)($|\?)/i)) {
      return MediaType.VIDEO;
    }
    
    if (url.match(/\.(mp3|wav|ogg|aac|flac)($|\?)/i)) {
      return MediaType.AUDIO;
    }
    
    return MediaType.UNKNOWN;
  }
  
  // If it's an object with mediaType or content_type field
  if (source.media_type) {
    const type = source.media_type.toLowerCase();
    if (type.includes('image')) return MediaType.IMAGE;
    if (type.includes('video')) return MediaType.VIDEO;
    if (type.includes('audio')) return MediaType.AUDIO;
    return MediaType.UNKNOWN;
  }
  
  // If it's an object with URL fields, try to determine from URL structure
  const url = extractMediaUrl(source);
  if (url) {
    return determineMediaType(url);
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extracts media URL from various media source formats
 * 
 * @param source Media source object or string
 * @returns Extracted URL or null if none found
 */
export const extractMediaUrl = (source: MediaSource | string): string | null => {
  if (typeof source === 'string') {
    return source;
  }
  
  // Check various possible URL properties
  if (source.media_url) return source.media_url;
  if (source.video_url) return source.video_url;
  if (source.image_url) return source.image_url;
  if (source.url) return source.url;
  if (source.src) return source.src;
  
  // Check array URLs (pick first one)
  if (source.media_urls && source.media_urls.length > 0) return source.media_urls[0];
  if (source.video_urls && source.video_urls.length > 0) return source.video_urls[0];
  
  return null;
};
