
import { supabase } from '@/integrations/supabase/client';
import { MediaType, UploadResult } from './types';
import { getFileExtension } from './urlUtils';

/**
 * Creates a unique file path for storage
 * @param userId - The user ID
 * @param file - The file to create a path for
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${userId}/${timestamp}-${random}/${sanitizedFileName}`;
}

/**
 * Uploads a file to Supabase storage
 * @param bucket - The storage bucket
 * @param path - The file path
 * @param file - The file to upload
 * @returns The upload result
 */
export async function uploadFileToStorage(bucket: string, path: string, file: File): Promise<UploadResult> {
  try {
    // Perform the upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return { 
        success: false, 
        error: error.message || 'Upload failed'
      };
    }
    
    if (!data || !data.path) {
      return { 
        success: false, 
        error: 'No data returned from upload'
      };
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred'
    };
  }
}

/**
 * Determines the media type from a URL or MediaSource object
 * @param source - The media source (URL or object)
 * @returns The media type
 */
export function determineMediaType(source: any): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // If it's a string URL
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    
    // Check by extension
    if (url.match(/\.(jpe?g|png|gif|webp|svg)($|\?)/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp4|webm|mov|avi|mkv)($|\?)/i)) return MediaType.VIDEO;
    if (url.match(/\.(mp3|wav|ogg|aac|m4a)($|\?)/i)) return MediaType.AUDIO;
    
    // Check by path patterns
    if (url.includes('/images/') || url.includes('/img/') || url.includes('/photos/')) {
      return MediaType.IMAGE;
    }
    if (url.includes('/videos/') || url.includes('/video/')) {
      return MediaType.VIDEO;
    }
    if (url.includes('/audio/') || url.includes('/sound/')) {
      return MediaType.AUDIO;
    }
    
    return MediaType.UNKNOWN;
  }
  
  // If it's a MediaSource object, try to determine from properties
  const mediaType = source.media_type;
  if (mediaType) {
    if (typeof mediaType === 'string') {
      switch (mediaType.toLowerCase()) {
        case 'image': return MediaType.IMAGE;
        case 'video': return MediaType.VIDEO;
        case 'audio': return MediaType.AUDIO;
        case 'file': return MediaType.FILE;
        default: break;
      }
    } else if (mediaType instanceof MediaType) {
      return mediaType;
    }
  }
  
  // Check for specific URL properties
  if (source.video_url || source.video_urls) return MediaType.VIDEO;
  if (source.media_url && typeof source.media_url === 'string') {
    return determineMediaType(source.media_url);
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extracts the media URL from a string or MediaSource object
 * @param source - The source to extract URL from
 * @returns The extracted URL or null if not found
 */
export function extractMediaUrl(source: any): string | null {
  if (!source) return null;
  
  // If it's a string, return it directly
  if (typeof source === 'string') return source;
  
  // Try to extract from various properties
  return source.media_url || 
         source.video_url || 
         source.src || 
         source.url || 
         (source.media_urls && source.media_urls[0]) ||
         (source.video_urls && source.video_urls[0]) ||
         null;
}
