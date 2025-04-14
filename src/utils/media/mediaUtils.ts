
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a unique file path for storage
 * @param userId - The user ID who is uploading the file
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/${Date.now()}_${sanitizedFileName}`;
};

/**
 * Uploads a file to Supabase storage
 * @param bucket - The bucket name to upload to
 * @param path - The path within the bucket
 * @param file - The file to upload
 * @returns A promise that resolves to the public URL or null
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<string | null> => {
  try {
    // Determine content type based on file extension
    const contentType = file.type || inferContentTypeFromExtension(file.name);
    
    console.log(`Uploading to ${bucket}/${path} with content type: ${contentType}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error(`Storage upload error for ${path}:`, error);
      return null;
    }
    
    if (!data || !data.path) {
      console.error(`No data returned from upload for ${path}`);
      return null;
    }
    
    // Get the public URL using Supabase
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log(`Upload successful. Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`File upload error for ${bucket}/${path}:`, error);
    return null;
  }
};

/**
 * Determines the content type from a file name or URL
 * @param fileName - The file name or URL to check
 * @returns Either "video" or "image"
 */
export const getContentType = (fileName: string): "video" | "image" => {
  if (!fileName) return "image"; // Default to image if no filename
  
  const lowerFileName = fileName.toLowerCase();
  
  // Check for video file extensions
  if (
    lowerFileName.endsWith('.mp4') ||
    lowerFileName.endsWith('.webm') ||
    lowerFileName.endsWith('.mov') ||
    lowerFileName.endsWith('.avi') ||
    lowerFileName.endsWith('.mkv') ||
    lowerFileName.includes('/video/') ||
    lowerFileName.includes('/shorts/')
  ) {
    return "video";
  }
  
  // Default to image
  return "image";
};

/**
 * Gets the playable media URL from a media item
 * @param item - The media item object
 * @returns The full, playable URL or null
 */
export const getPlayableMediaUrl = (item: any): string | null => {
  // Handle direct string input
  if (typeof item === 'string') {
    return ensureFullUrl(item);
  }
  
  if (!item) {
    console.error('Invalid media item: null or undefined');
    return null;
  }
  
  // Extract URL from object based on available properties
  const url = 
    item.video_url || 
    (Array.isArray(item.video_urls) && item.video_urls.length > 0 ? item.video_urls[0] : null) ||
    item.media_url ||
    (Array.isArray(item.media_url) && item.media_url.length > 0 ? item.media_url[0] : null) ||
    item.url ||
    item.src ||
    '';
  
  return ensureFullUrl(url);
};

/**
 * Ensures the URL is a complete, usable URL
 * @param url - The URL to check and possibly modify
 * @returns A complete URL or null
 */
export const ensureFullUrl = (url: string): string | null => {
  if (!url) {
    return null;
  }
  
  // If already a complete URL, return as is
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
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Failed to get public URL for ${url}:`, error);
    return null;
  }
};

/**
 * Adds a cache buster to a URL to prevent caching issues
 * @param url - The URL to add a cache buster to
 * @returns The URL with cache buster added
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
};

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
