import { MediaType, MediaSource } from './types';
import { isImageUrl, isVideoUrl, isAudioUrl } from './urlUtils';

/**
 * Create a unique file path for upload
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random();
  const fileExt = file.name.split('.').pop() || '';
  return `${userId}/${timestamp}_${random.toString(36).substring(2, 8)}.${fileExt}`;
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // This is just the implementation signature
    // The actual implementation would use the Supabase client
    console.log(`Uploading ${file.name} to ${bucket}/${path}`);
    return {
      success: true,
      url: `https://example.com/storage/${bucket}/${path}`
    };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error.message || "Failed to upload file"
    };
  }
}

/**
 * Get content type from file name
 */
export function getContentType(fileName: string): MediaType | string {
  if (isImageUrl(fileName)) return MediaType.IMAGE;
  if (isVideoUrl(fileName)) return MediaType.VIDEO;
  if (isAudioUrl(fileName)) return MediaType.AUDIO;
  return MediaType.UNKNOWN;
}

/**
 * Determine the type of media from a URL or object
 */
export function determineMediaType(source: MediaSource | string): MediaType | string {
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  // Check explicit media_type if available
  if (typeof source !== 'string' && source.media_type) {
    return source.media_type;
  }
  
  // Otherwise infer from URL
  if (isImageUrl(url)) return MediaType.IMAGE;
  if (isVideoUrl(url)) return MediaType.VIDEO;
  if (isAudioUrl(url)) return MediaType.AUDIO;
  
  return MediaType.UNKNOWN;
}

/**
 * Extract media URL from various source formats
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string {
  if (!source) return '';
  
  if (typeof source === 'string') {
    return source;
  }
  
  // Check for video_url first, then media_url
  return source.video_url || 
         (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
         source.media_url || 
         (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
         source.url || 
         source.src || 
         '';
}
