
import { supabase } from '@/integrations/supabase/client';
import { getFileExtension } from './urlUtils';
import { MediaSource, MediaType } from './types';

/**
 * Create a unique file path for storage
 * @param file File to upload
 * @param folder Folder to save in storage
 * @param userId User ID for path creation
 * @returns Unique path for the file
 */
export const createUniqueFilePath = (
  file: File | string, 
  folder: string = 'media', 
  userId: string | null = null
): string => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  
  let extension;
  if (typeof file === 'string') {
    // Handle string paths
    extension = file.split('.').pop()?.toLowerCase() || '';
  } else {
    // Handle File objects
    extension = getFileExtension(file.name);
  }
  
  const userPath = userId ? `${userId}/` : '';
  
  return `${folder}/${userPath}${timestamp}_${random}.${extension}`;
};

/**
 * Upload a file to storage
 * @param file File to upload
 * @param bucket Bucket name
 * @param userId User ID for path creation
 * @param options Upload options
 * @returns Upload result
 */
export const uploadFileToStorage = async (
  file: File,
  bucket: string = 'media',
  userId: string | null = null,
  options: {
    contentType?: string;
    upsert?: boolean;
  } = {}
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> => {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  try {
    const filePath = createUniqueFilePath(file, bucket === 'media' ? 'media' : bucket, userId);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: options.contentType || file.type,
        upsert: options.upsert || false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData?.publicUrl,
      path: data?.path || filePath
    };
  } catch (error: any) {
    console.error('Failed to upload file:', error);
    return { success: false, error: error.message || 'Failed to upload file' };
  }
};

/**
 * Helper function to determine if the media is valid
 */
export const isMediaValid = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return !url.includes('undefined') && !url.includes('null');
};

/**
 * Detect media type based on URL or MediaSource object
 */
export const detectMediaType = (source: any): string => {
  if (!source) return 'unknown';
  
  // If it's a string URL
  if (typeof source === 'string') {
    if (source.match(/\.(jpeg|jpg|gif|png|webp|avif|svg)$/i)) return 'image';
    if (source.match(/\.(mp4|webm|ogg|mov|mkv)$/i)) return 'video';
    if (source.match(/\.(mp3|wav|ogg|flac)$/i)) return 'audio';
    if (source.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i)) return 'document';
    return 'unknown';
  }
  
  // If it's an object with type information
  if (source.media_type) return source.media_type;
  if (source.type) return source.type;
  
  // Check for video URLs
  if (source.video_url || source.videoUrl) return 'video';
  
  // Check for image URLs
  if ((source.url || source.src || source.media_url) && 
     !source.video_url && !source.videoUrl) {
    return 'image';
  }
  
  return 'unknown';
};

/**
 * Alias for detectMediaType to maintain backward compatibility
 */
export const determineMediaType = detectMediaType;

/**
 * Extract media URL from various source formats
 */
export const extractMediaUrl = (source: MediaSource | string): string | null => {
  // If source is already a string URL
  if (typeof source === 'string') return source;
  
  // Handle different source formats
  return source.video_url || 
         source.media_url || 
         source.url || 
         source.src || 
         (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : null) ||
         (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
         null;
};

/**
 * Convert any media source to a standard MediaSource object
 */
export const normalizeMediaSource = (source: any): MediaSource => {
  if (!source) return { media_type: MediaType.UNKNOWN };
  
  // If it's already a string, create a basic MediaSource
  if (typeof source === 'string') {
    const mediaType = detectMediaType(source);
    return {
      url: source,
      media_type: mediaType as MediaType,
      media_url: mediaType === 'image' ? source : undefined,
      video_url: mediaType === 'video' ? source : undefined
    };
  }
  
  // It's already an object, normalize it
  return {
    ...source,
    media_type: source.media_type || detectMediaType(source)
  };
};
