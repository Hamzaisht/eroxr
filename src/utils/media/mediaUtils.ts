
import { MediaType, MediaSource } from './types';
import { isImageUrl, isVideoUrl, isAudioUrl } from './urlUtils';

/**
 * Extract a media URL from a source object or string
 */
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If source is already a string, return it
  if (typeof source === 'string') return source;
  
  // Try to extract URL from different possible properties
  const url = source.url || 
              source.src ||
              source.media_url || 
              source.video_url || 
              (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) || 
              (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null);
              
  return url || null;
}

/**
 * Determine the media type from a source object or URL
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  // For string sources, check directly
  if (typeof source === 'string') {
    if (isVideoUrl(source)) return MediaType.VIDEO;
    if (isImageUrl(source)) return MediaType.IMAGE;
    if (isAudioUrl(source)) return MediaType.AUDIO;
    return MediaType.UNKNOWN;
  }
  
  // For source objects, first check if there's an explicit type property
  if ('type' in source && source.type) {
    const type = String(source.type).toLowerCase();
    if (type === 'video') return MediaType.VIDEO;
    if (type === 'image') return MediaType.IMAGE;
    if (type === 'audio') return MediaType.AUDIO;
    if (type === 'document') return MediaType.DOCUMENT;
  }

  // Check media_type or content_type if available
  if (source.media_type) {
    const mediaType = String(source.media_type).toLowerCase();
    if (mediaType === 'video') return MediaType.VIDEO;
    if (mediaType === 'image') return MediaType.IMAGE;
    if (mediaType === 'audio') return MediaType.AUDIO;
  }

  if (source.content_type) {
    const contentType = String(source.content_type).toLowerCase();
    if (contentType.includes('video')) return MediaType.VIDEO;
    if (contentType.includes('image')) return MediaType.IMAGE;
    if (contentType.includes('audio')) return MediaType.AUDIO;
  }
  
  // If no explicit type, check URL patterns
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  // Check for video indicators
  if (
    source.video_url || 
    source.video_urls?.length || 
    isVideoUrl(url) ||
    url.includes('video') ||
    url.includes('mp4')
  ) {
    return MediaType.VIDEO;
  }
  
  // Check for image indicators
  if (
    source.media_url || 
    source.media_urls?.length || 
    isImageUrl(url) ||
    url.includes('image') ||
    url.includes('photo')
  ) {
    return MediaType.IMAGE;
  }
  
  // Check URL extensions as a fallback
  if (isVideoUrl(url)) return MediaType.VIDEO;
  if (isImageUrl(url)) return MediaType.IMAGE;
  if (isAudioUrl(url)) return MediaType.AUDIO;
  
  return MediaType.UNKNOWN;
}

/**
 * Get a thumbnail URL from a media source
 */
export function getThumbnailUrl(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If source is a string, there's no thumbnail info
  if (typeof source === 'string') return null;
  
  // Try to extract thumbnail URL from different possible properties
  return source.thumbnail_url || 
         source.video_thumbnail_url || 
         null;
}

/**
 * Create a unique file path for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const ext = file.name.split('.').pop() || '';
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  
  return `${userId}/${timestamp}_${randomId}.${ext}`;
}

/**
 * Get content type from file or URL
 */
export function getContentType(fileOrUrl: File | string): string {
  if (typeof fileOrUrl === 'string') {
    const ext = fileOrUrl.split('.').pop()?.toLowerCase();
    
    if (!ext) return 'application/octet-stream';
    
    switch (ext) {
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
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  } else {
    return fileOrUrl.type || 'application/octet-stream';
  }
}

/**
 * Upload a file to storage
 */
export async function uploadFileToStorage(
  bucket: string, 
  filePath: string, 
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // This would normally interact with a storage API like Supabase
    // For now, we'll simulate a successful upload with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be the URL returned from storage
    const url = `https://storage.example.com/${bucket}/${filePath}`;
    
    console.log(`File ${file.name} uploaded to ${bucket}/${filePath}`);
    
    return {
      success: true,
      url
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
}
