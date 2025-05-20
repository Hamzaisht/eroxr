
import { supabase } from '@/integrations/supabase/client';
import { MediaSource, MediaType } from '@/types/media';

/**
 * Creates a unique file path for storage based on user ID and file
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop() || 'jpg';
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  filePath: string, 
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error('Unexpected upload error:', error);
    return { success: false, error: error.message || 'Unknown upload error' };
  }
};

/**
 * Extract media URL from various formats
 */
export const extractMediaUrl = (src: string | MediaSource): string => {
  if (typeof src === 'string') {
    return src;
  }
  
  if (src && typeof src === 'object') {
    if ('url' in src) return src.url;
    if ('media_url' in src) return src.media_url as string;
    if ('video_url' in src) return src.video_url as string;
  }
  
  return '';
};

/**
 * Normalize media source to ensure consistent format
 */
export const normalizeMediaSource = (source: string | MediaSource): MediaSource => {
  if (typeof source === 'string') {
    // Determine media type from URL
    const url = source;
    const type = detectMediaType(url);
    
    return { url, type };
  }
  
  if (source && typeof source === 'object' && 'url' in source) {
    // Ensure type is correct MediaType enum
    if (typeof source.type === 'string' && source.type !== 'image' && 
        source.type !== 'video' && source.type !== 'audio' && 
        source.type !== 'document' && source.type !== 'gif' && 
        source.type !== 'unknown') {
      return {
        ...source,
        type: detectMediaType(source.url)
      };
    }
    // Return existing MediaSource
    return source;
  }
  
  // Fallback
  return { url: '', type: MediaType.UNKNOWN };
};

/**
 * Detect media type from URL or content type
 */
export const detectMediaType = (url: string): MediaType => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  if (['gif'].includes(extension)) {
    return MediaType.GIF;
  }
  
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

// Add alias for backward compatibility
export const determineMediaType = detectMediaType;
