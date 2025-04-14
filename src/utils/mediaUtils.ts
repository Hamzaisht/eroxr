import { supabase } from "@/integrations/supabase/client";
import { isImageFile, isVideoFile } from "./upload/validators";

/**
 * Interface for upload options
 */
export interface UploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic' | 'avatar';
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param file - The file to upload
 * @param userId - User ID for creating path
 * @param options - Upload options
 * @returns UploadResult with success status and URL
 */
export const uploadFileToStorage = async (
  file: File,
  userId: string,
  options?: UploadOptions
): Promise<UploadResult> => {
  try {
    // Determine content type based on file extension
    const contentType = file.type || inferContentTypeFromExtension(file.name);
    
    // Determine the bucket based on content category
    const contentCategory = options?.contentCategory || 'generic';
    let bucketName = 'media';
    
    switch (contentCategory) {
      case 'story':
        bucketName = 'stories';
        break;
      case 'post':
        bucketName = 'posts';
        break;
      case 'message':
        bucketName = 'messages';
        break;
      case 'profile':
        bucketName = 'avatars';
        break;
      case 'short':
        bucketName = 'shorts';
        break;
      case 'avatar':
        bucketName = 'avatars';
        break;
      default:
        bucketName = 'media';
    }

    // Create a unique file path
    const filePath = createUniqueFilePath(userId, file);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL of the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data?.path || filePath);

    return {
      success: true,
      url: publicUrl
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred during upload'
    };
  }
};

/**
 * Create a unique file path for storage
 * @param userId - The user ID who is uploading the file
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  return `${userId}/${Date.now()}_${file.name}`;
};

// Add this alias for compatibility with existing code
export const createUserFilePath = createUniqueFilePath;

/**
 * Infer content type from file extension
 * @param filename - The filename to check
 * @returns The MIME type for the file
 */
export const inferContentTypeFromExtension = (filename: string): string => {
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
};

/**
 * Get the playable media URL from a media object
 * @param media - Media object with potential URLs
 * @returns The full, playable URL
 */
export const getPlayableMediaUrl = (media: any): string => {
  if (!media) return '';
  
  // Handle direct string input
  if (typeof media === 'string') {
    return ensureFullUrl(media);
  }
  
  // Extract URL from object based on available properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    (typeof media.media_url === 'string' ? media.media_url : null) ||
    (Array.isArray(media.media_url) && media.media_url.length > 0 ? media.media_url[0] : null) ||
    media.url ||
    media.src ||
    '';
  
  return ensureFullUrl(url || '');
};

/**
 * Ensure the URL is a complete, usable URL
 * @param url - The URL to check and possibly modify
 * @returns A complete URL
 */
export const ensureFullUrl = (url: string): string => {
  if (!url) return '';
  
  // If already a complete URL or a data/blob URL, return as is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it starts with a slash, remove it
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;
  
  // Determine the bucket from the path if possible
  let bucket = 'media';
  const possibleBuckets = ['stories', 'posts', 'videos', 'avatars', 'media', 'shorts'];
  
  for (const b of possibleBuckets) {
    if (cleanPath.startsWith(`${b}/`) || cleanPath.includes(`/${b}/`)) {
      bucket = b;
      break;
    }
  }
  
  // Get the public URL using Supabase
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(cleanPath);
    
    return data?.publicUrl || '';
  } catch (error) {
    console.error(`Failed to get public URL for ${url}:`, error);
    return '';
  }
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Prevent recursive cache busting by checking for existing timestamp
  if (url.includes('t=') && url.includes('&r=')) {
    return url;
  }
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

// Re-export validator functions from utils/upload/validators
export { isImageFile, isVideoFile } from "./upload/validators";
