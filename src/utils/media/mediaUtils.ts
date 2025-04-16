
import { v4 as uuidv4 } from 'uuid';
import { MediaType, MediaSource, UploadResult } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const fileExt = file.name.split('.').pop() || 'unknown';
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}-${uniqueId}.${fileExt}`;
};

/**
 * Determines the media type from a source object or URL
 */
export const determineMediaType = (source: MediaSource | string): MediaType => {
  // If source is a string, assume it's a URL
  if (typeof source === 'string') {
    return getMediaTypeFromUrl(source);
  }
  
  // Check explicit media_type or content_type properties
  if (source.media_type === 'video' || source.content_type === 'video') {
    return MediaType.VIDEO;
  }
  
  if (source.media_type === 'image' || source.content_type === 'image') {
    return MediaType.IMAGE;
  }
  
  // Check URL properties to determine type
  if (source.video_url || source.video_urls) {
    return MediaType.VIDEO;
  }
  
  // Try to determine from media_url
  const mediaUrl = extractMediaUrl(source);
  if (mediaUrl) {
    return getMediaTypeFromUrl(mediaUrl);
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extract a usable URL from various media source formats
 */
export const extractMediaUrl = (source: MediaSource | string): string | null => {
  if (typeof source === 'string') {
    return source;
  }
  
  // Try all possible URL fields in order of likelihood
  return source.media_url || 
    source.video_url || 
    (source.media_urls && source.media_urls[0]) || 
    (source.video_urls && source.video_urls[0]) ||
    source.url || 
    source.src || 
    null;
};

/**
 * Determine media type from a URL string
 */
export const getMediaTypeFromUrl = (url: string): MediaType => {
  const lowerUrl = url.toLowerCase();
  
  // Check for video file extensions
  if (/\.(mp4|webm|mov|avi|wmv|mkv|flv)($|\?)/.test(lowerUrl)) {
    return MediaType.VIDEO;
  }
  
  // Check for image file extensions
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/.test(lowerUrl)) {
    return MediaType.IMAGE;
  }
  
  // Check for audio file extensions
  if (/\.(mp3|wav|ogg|flac|aac)($|\?)/.test(lowerUrl)) {
    return MediaType.AUDIO;
  }
  
  // Check for document file extensions
  if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/.test(lowerUrl)) {
    return MediaType.DOCUMENT;
  }
  
  // Check URL patterns that might suggest video
  if (lowerUrl.includes('/videos/') || 
      lowerUrl.includes('/video/') || 
      lowerUrl.includes('/shorts/')) {
    return MediaType.VIDEO;
  }
  
  // Check URL patterns that might suggest images
  if (lowerUrl.includes('/images/') || 
      lowerUrl.includes('/image/') || 
      lowerUrl.includes('/photos/')) {
    return MediaType.IMAGE;
  }
  
  // Default to unknown if we can't determine
  return MediaType.UNKNOWN;
};

/**
 * Get content type based on URL or file name
 */
export const getContentType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Upload a file to Supabase storage and return the public URL
 */
export const uploadFileToStorage = async (
  bucket: string, 
  path: string, 
  file: File
): Promise<UploadResult> => {
  try {
    // Upload to storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false,
        error: error.message
      };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return {
      success: true,
      url: publicUrl
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Get the file extension from a MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    case 'video/mp4':
      return 'mp4';
    case 'video/webm':
      return 'webm';
    case 'video/quicktime':
      return 'mov';
    default:
      return 'bin';
  }
};

/**
 * Infer content type from file extension
 */
export const inferContentTypeFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return getContentType(extension);
};

/**
 * Get storage URL for a file
 */
export const getStorageUrl = (bucket: string, path: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
};
