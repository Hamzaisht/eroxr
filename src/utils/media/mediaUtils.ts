import { MediaType, MediaSource } from './types';

/**
 * Determine the type of media based on the file extension or content type
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  // For string URLs, check by extension
  if (typeof source === 'string') {
    const url = source.toLowerCase();
    if (url.match(/\.(mp4|webm|mov|m4v|avi|wmv)$/)) return MediaType.VIDEO;
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) return MediaType.IMAGE;
    if (url.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/)) return MediaType.AUDIO;
    if (url.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/)) return MediaType.DOCUMENT;
    return MediaType.UNKNOWN;
  }

  // For object sources, check content type or media_type if available
  const contentType = source.content_type?.toLowerCase() || '';
  const mediaType = source.media_type?.toLowerCase() || '';

  if (
    contentType.includes('video') || 
    mediaType.includes('video') ||
    source.video_url ||
    (source.video_urls && source.video_urls.length > 0)
  ) {
    return MediaType.VIDEO;
  }

  if (
    contentType.includes('image') || 
    mediaType.includes('image')
  ) {
    return MediaType.IMAGE;
  }

  if (
    contentType.includes('audio') || 
    mediaType.includes('audio')
  ) {
    return MediaType.AUDIO;
  }

  if (
    contentType.includes('pdf') || 
    contentType.includes('document') || 
    contentType.includes('application')
  ) {
    return MediaType.DOCUMENT;
  }

  return MediaType.UNKNOWN;
}

/**
 * Extract the primary media URL from a media source object
 */
export function extractMediaUrl(source: any): string {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  return source.video_url || 
         (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
         source.media_url || 
         (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
         source.url || 
         source.src || 
         '';
}

/**
 * Create a unique file path for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a file to storage
 */
export async function uploadFileToStorage(
  bucket: string, 
  path: string, 
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Placeholder for real upload implementation
    // In a real implementation, this would use Supabase Storage or another service
    console.log(`Uploading file to ${bucket}/${path}`);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock URL
    return {
      success: true,
      url: `https://example.com/${bucket}/${path}`
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
}

/**
 * Get a playable media URL from any source
 */
export function getPlayableMediaUrl(source: MediaSource | string): string {
  const url = typeof source === 'string' ? source : extractMediaUrl(source);
  if (!url) return '';
  
  // Add cache busting to ensure fresh content
  const separator = url.includes('?') ? '&' : '?';
  const cacheBuster = `cache=${Date.now()}`;
  return `${url}${separator}${cacheBuster}`;
}

/**
 * Get the content type from a URL or file extension
 */
export function getContentType(url: string): string {
  if (!url) return 'application/octet-stream';
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  // Map common file extensions to content types
  switch (extension) {
    // Images
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
      
    // Videos
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
      
    // Audio
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
      
    // Documents
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
      
    default:
      return 'application/octet-stream';
  }
}
