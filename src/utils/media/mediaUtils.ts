
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { MediaType, MediaSource } from './types';

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

// Create a unique file path for uploads
export const createUniqueFilePath = (userId: string, file: File): string => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  return `${userId}/${fileName}`;
};

// Upload file to storage
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<UploadResult> => {
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { 
      success: true, 
      url: data?.publicUrl,
      path: path
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to upload file' 
    };
  }
};

// Get file from storage
export const getFileFromStorage = async (
  bucket: string,
  path: string
): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
};

// Delete file from storage
export const deleteFileFromStorage = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

// NEW FUNCTION: Determine media type based on source
export const determineMediaType = (source: MediaSource | string): MediaType => {
  // If it's a string, try to determine by URL/extension
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    
    // Check for video extensions and paths
    if (
      url.endsWith('.mp4') || 
      url.endsWith('.webm') || 
      url.endsWith('.mov') ||
      url.includes('videos/') ||
      url.includes('/video/')
    ) {
      return MediaType.VIDEO;
    }
    
    // Check for audio extensions
    if (
      url.endsWith('.mp3') || 
      url.endsWith('.wav') || 
      url.endsWith('.ogg') ||
      url.includes('/audio/')
    ) {
      return MediaType.AUDIO;
    }
    
    // Default to image for unknown URLs
    return MediaType.IMAGE;
  }
  
  // Handle MediaSource object
  const mediaSource = source as MediaSource;
  
  // Check explicit media_type property
  if (mediaSource.media_type) {
    if (typeof mediaSource.media_type === 'string') {
      const type = mediaSource.media_type.toLowerCase();
      if (type === 'video') return MediaType.VIDEO;
      if (type === 'audio') return MediaType.AUDIO;
      if (type === 'image') return MediaType.IMAGE;
    } else {
      return mediaSource.media_type; // If it's already a MediaType enum
    }
  }
  
  // Check for content_type
  if (mediaSource.content_type) {
    const contentType = mediaSource.content_type.toLowerCase();
    if (contentType.includes('video')) return MediaType.VIDEO;
    if (contentType.includes('audio')) return MediaType.AUDIO;
    if (contentType.includes('image')) return MediaType.IMAGE;
  }
  
  // Check for video-related properties
  if (mediaSource.video_url || mediaSource.video_urls || mediaSource.video_thumbnail_url) {
    return MediaType.VIDEO;
  }
  
  // Check for image-related properties (default case)
  return MediaType.IMAGE;
};

// NEW FUNCTION: Extract media URL from different source formats
export const extractMediaUrl = (source: MediaSource | string): string | null => {
  if (!source) return null;
  
  // If source is already a string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Handle MediaSource object
  const mediaSource = source as MediaSource;
  
  // Try to get URL from various possible properties
  return mediaSource.media_url || 
         mediaSource.video_url || 
         (Array.isArray(mediaSource.media_urls) && mediaSource.media_urls.length > 0 ? mediaSource.media_urls[0] : null) ||
         (Array.isArray(mediaSource.video_urls) && mediaSource.video_urls.length > 0 ? mediaSource.video_urls[0] : null) ||
         mediaSource.thumbnail_url ||
         mediaSource.url ||
         null;
};

// Add inferContentTypeFromExtension function to fix import errors in other files
export const inferContentTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
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
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'application/octet-stream';
  }
};

// Report media errors for analytics or debugging
export const reportMediaError = (
  url: string,
  errorType: 'load_failure' | 'playback_error' | 'format_error',
  retryCount: number,
  mediaType: 'video' | 'image' | 'audio',
  componentName: string
) => {
  console.error(`Media error in ${componentName}:`, {
    url,
    errorType,
    retryCount,
    mediaType,
    timestamp: new Date().toISOString()
  });
  
  // This function could be expanded to send errors to an analytics service
};
