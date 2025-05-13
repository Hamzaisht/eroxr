
import { MediaType, MediaSource } from "./types";

/**
 * Determine the media type from a URL or MediaSource object
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  // Handle string source
  if (typeof source === 'string') {
    return getMediaTypeFromUrl(source);
  }
  
  // If media_type is already provided, use it
  if (source.media_type) {
    return source.media_type;
  }
  
  // Use the most specific URL available
  const url = source.url || source.video_url || source.media_url || source.src;
  
  if (!url) {
    return MediaType.UNKNOWN;
  }
  
  return getMediaTypeFromUrl(url);
}

/**
 * Get the media type from a URL based on file extension
 */
function getMediaTypeFromUrl(url: string): MediaType {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'bmp':
    case 'svg':
      return MediaType.IMAGE;
    case 'gif':
      return MediaType.GIF;
    case 'mp4':
    case 'webm':
    case 'mov':
    case 'avi':
    case 'mkv':
      return MediaType.VIDEO;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return MediaType.AUDIO;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
      return MediaType.DOCUMENT;
    default:
      return MediaType.UNKNOWN;
  }
}

/**
 * Extract the media URL from a string or MediaSource object
 */
export function extractMediaUrl(source: string | MediaSource): string | null {
  if (typeof source === 'string') {
    return source;
  }
  
  return source.url || source.video_url || source.media_url || source.src || null;
}

/**
 * Upload a file to storage
 */
export async function uploadFileToStorage(
  bucket: string, 
  path: string, 
  file: File,
  options: { 
    generateThumbnail?: boolean,
    addWatermark?: boolean,
    isPublic?: boolean,
    metadata?: Record<string, any>
  } = {}
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Placeholder implementation - actual implementation would use Supabase or another storage provider
    console.log(`Uploading ${file.name} to ${bucket}/${path}`);
    
    // Mock successful upload after a brief delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock URL
    return {
      success: true,
      url: `https://storage.example.com/${bucket}/${path}`
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
}

/**
 * Generate a unique file path for uploads
 */
export function createUniqueFilePath(userId: string, fileName: string, prefix = ''): string {
  const timestamp = new Date().getTime();
  const extension = fileName.split('.').pop() || '';
  const safeName = fileName
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  
  return `${prefix ? prefix + '/' : ''}${userId}/${timestamp}_${safeName}.${extension}`;
}

/**
 * Media orchestrator for handling media sources
 */
export const mediaOrchestrator = {
  process: (source: string | MediaSource): MediaSource => {
    // Convert string to MediaSource
    if (typeof source === 'string') {
      return { 
        url: source,
        media_type: determineMediaType(source)
      };
    }
    
    // Normalize existing MediaSource
    const normalizedSource: MediaSource = { ...source };
    
    // Ensure URL is set
    if (!normalizedSource.url) {
      if (normalizedSource.video_url) {
        normalizedSource.url = normalizedSource.video_url;
      } else if (normalizedSource.media_url) {
        normalizedSource.url = normalizedSource.media_url;
      } else if (normalizedSource.src) {
        normalizedSource.url = normalizedSource.src;
      }
    }
    
    // Ensure media_type is set
    if (!normalizedSource.media_type) {
      normalizedSource.media_type = determineMediaType(normalizedSource);
    }
    
    return normalizedSource;
  }
};
