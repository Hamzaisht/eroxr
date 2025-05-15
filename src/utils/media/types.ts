// Media types enum
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

// Media source interface
export interface MediaSource {
  url?: string;
  media_url?: string;
  video_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  media_type?: MediaType;
  content_type?: string;
  duration?: number;
  width?: number;
  height?: number;
}

// Upload options interface
export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  contentType?: string;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

// User availability status
export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

/**
 * Normalize media source to ensure it has consistent properties
 */
export function normalizeMediaSource(source: string | MediaSource): MediaSource {
  // If source is a string, treat it as a URL
  if (typeof source === 'string') {
    return { url: source };
  }
  
  // Otherwise, ensure it has a url property
  const mediaSource: MediaSource = { ...source };
  if (!mediaSource.url) {
    mediaSource.url = mediaSource.media_url || 
                      mediaSource.video_url || 
                      mediaSource.image_url || 
                      mediaSource.thumbnail_url || 
                      '';
  }
  
  return mediaSource;
}
