
import { MediaType, MediaSource } from './types';

/**
 * Determine the content type of a media source
 */
export function getContentType(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If source is a string, try to infer from extension
  if (typeof source === 'string') {
    return inferContentTypeFromExtension(source);
  }
  
  // If we have explicit content_type, use it
  if (source.content_type) {
    return source.content_type;
  }
  
  // If we have media_type, convert it
  if (source.media_type) {
    switch (source.media_type.toLowerCase()) {
      case 'video': return 'video/mp4';
      case 'image': return 'image/jpeg';
      case 'audio': return 'audio/mp3';
      default: break;
    }
  }
  
  // Try to infer from URLs
  const videoUrl = source.video_url || (source.video_urls && source.video_urls[0]);
  if (videoUrl) {
    return 'video/mp4';
  }
  
  const mediaUrl = source.media_url || (source.media_urls && source.media_urls[0]) || source.url || source.src;
  if (mediaUrl && typeof mediaUrl === 'string') {
    return inferContentTypeFromExtension(mediaUrl);
  }
  
  return null;
}

/**
 * Determine media type from a source object or string
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // Direct string path
  if (typeof source === 'string') {
    return inferMediaTypeFromPath(source);
  }
  
  // Explicit media/content type
  if (source.media_type) {
    switch (source.media_type.toLowerCase()) {
      case 'video': return MediaType.VIDEO;
      case 'image': return MediaType.IMAGE;
      case 'audio': return MediaType.AUDIO;
      default: break;
    }
  }
  
  if (source.content_type) {
    if (source.content_type.startsWith('video/')) return MediaType.VIDEO;
    if (source.content_type.startsWith('image/')) return MediaType.IMAGE;
    if (source.content_type.startsWith('audio/')) return MediaType.AUDIO;
    if (source.content_type.startsWith('application/pdf')) return MediaType.DOCUMENT;
  }
  
  // Check video-specific properties
  if (source.video_url || (Array.isArray(source.video_urls) && source.video_urls.length > 0)) {
    return MediaType.VIDEO;
  }
  
  // Check for media URL and infer from it
  const mediaUrl = source.media_url || 
                  (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
                  source.url || 
                  source.src;
  
  if (mediaUrl && typeof mediaUrl === 'string') {
    return inferMediaTypeFromPath(mediaUrl);
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Infer media type from file path or URL
 */
export function inferMediaTypeFromPath(path: string): MediaType {
  if (!path) return MediaType.UNKNOWN;
  
  const lowercasePath = path.toLowerCase();
  
  // Video extensions
  if (/\.(mp4|webm|ogv|mov|avi|wmv|flv|mkv)$/i.test(lowercasePath)) {
    return MediaType.VIDEO;
  }
  
  // Image extensions
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|avif)$/i.test(lowercasePath)) {
    return MediaType.IMAGE;
  }
  
  // Audio extensions
  if (/\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(lowercasePath)) {
    return MediaType.AUDIO;
  }
  
  // Document extensions
  if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(lowercasePath)) {
    return MediaType.DOCUMENT;
  }
  
  // Try to infer from URL patterns
  if (lowercasePath.includes('video') || lowercasePath.includes('watch')) {
    return MediaType.VIDEO;
  }
  
  if (lowercasePath.includes('image') || lowercasePath.includes('photo')) {
    return MediaType.IMAGE;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(path: string): string {
  if (!path) return 'application/octet-stream';
  
  const lowercasePath = path.toLowerCase();
  
  // Video
  if (lowercasePath.endsWith('.mp4')) return 'video/mp4';
  if (lowercasePath.endsWith('.webm')) return 'video/webm';
  if (lowercasePath.endsWith('.ogv')) return 'video/ogg';
  if (lowercasePath.endsWith('.mov')) return 'video/quicktime';
  
  // Image
  if (lowercasePath.endsWith('.jpg') || lowercasePath.endsWith('.jpeg')) return 'image/jpeg';
  if (lowercasePath.endsWith('.png')) return 'image/png';
  if (lowercasePath.endsWith('.gif')) return 'image/gif';
  if (lowercasePath.endsWith('.webp')) return 'image/webp';
  if (lowercasePath.endsWith('.svg')) return 'image/svg+xml';
  
  // Audio
  if (lowercasePath.endsWith('.mp3')) return 'audio/mpeg';
  if (lowercasePath.endsWith('.wav')) return 'audio/wav';
  if (lowercasePath.endsWith('.ogg')) return 'audio/ogg';
  
  // Document
  if (lowercasePath.endsWith('.pdf')) return 'application/pdf';
  
  return 'application/octet-stream';
}

/**
 * Extract a direct media URL from a variety of sources
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string {
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
 * Create a unique file path for storage based on user ID and file
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString().slice(2, 8);
  const extension = file.name.split('.').pop();
  return `${userId}/${timestamp}_${random}.${extension}`;
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
    // Normally we'd use supabase.storage here, but as a stub:
    console.log(`Uploading ${file.name} to ${bucket}/${path}`);
    
    // Simulate an API call
    const url = `/api/storage/${bucket}/${path}`;
    
    return {
      success: true,
      url
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}
