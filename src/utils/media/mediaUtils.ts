
import { MediaType, MediaSource } from './types';
import { isImageUrl, isVideoUrl, isAudioUrl } from './urlUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Determine the media type based on URL or MediaSource object
 * @param media - URL string or MediaSource object
 * @returns MediaType enum value
 */
export function determineMediaType(media: string | MediaSource): MediaType {
  // If media is already typed, use that
  if (typeof media !== 'string' && media.media_type) {
    if (typeof media.media_type === 'string') {
      switch (media.media_type.toLowerCase()) {
        case 'image':
          return MediaType.IMAGE;
        case 'video':
          return MediaType.VIDEO;
        case 'audio':
          return MediaType.AUDIO;
        case 'document':
          return MediaType.DOCUMENT;
        case 'gif':
          return MediaType.GIF;
        default:
          break;
      }
    } else {
      return media.media_type;
    }
  }

  // Handle string URLs
  let url: string | null = null;
  
  if (typeof media === 'string') {
    url = media;
  } else {
    // Check for video_url first since that's a stronger signal
    if (media.video_url) {
      return MediaType.VIDEO;
    }
    
    // Then try any available URL
    url = media.url || media.media_url || media.src || null;
  }

  if (!url) {
    return MediaType.UNKNOWN;
  }

  // Determine type by file extension
  if (isVideoUrl(url)) {
    return MediaType.VIDEO;
  } else if (isImageUrl(url)) {
    if (url.toLowerCase().endsWith('.gif')) {
      return MediaType.GIF;
    }
    return MediaType.IMAGE;
  } else if (isAudioUrl(url)) {
    return MediaType.AUDIO;
  }

  // Default to unknown
  return MediaType.UNKNOWN;
}

/**
 * Creates a unique file path for media uploads
 * @param userId User ID for folder organization
 * @param file The file being uploaded
 * @returns A unique path string
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = new Date().getTime();
  const uuid = uuidv4().substring(0, 8);
  const fileExtension = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${uuid}.${fileExtension}`;
}

/**
 * Upload a file to Supabase storage
 * @param bucket Bucket name
 * @param path File path in storage
 * @param file File to upload
 * @returns Upload result with URL or error
 */
export async function uploadFileToStorage(
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Import here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
}

export const mediaOrchestrator = {
  mediaRequests: new Map<string, any>(),
  
  createMediaId(media: MediaSource | string): string {
    if (typeof media === 'string') {
      return media;
    }
    
    const url = media.url || media.video_url || media.media_url || '';
    return url || uuidv4();
  },
  
  registerMediaRequest(media: MediaSource | string): void {
    const id = this.createMediaId(media);
    if (!this.mediaRequests.has(id)) {
      this.mediaRequests.set(id, {
        media,
        timestamp: Date.now()
      });
    }
  }
};
