
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
  
  if (src && typeof src === 'object' && 'url' in src) {
    return src.url;
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
    // Return existing MediaSource
    return source;
  }
  
  // Fallback
  return { url: '', type: MediaType.UNKNOWN };
};

/**
 * Detect media type from URL
 */
export const detectMediaType = (url: string): MediaType => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
};
