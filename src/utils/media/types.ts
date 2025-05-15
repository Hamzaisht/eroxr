
// Media types enum
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  GIF = 'gif',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

// User availability status
export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible'
}

// Media options interface
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time?: number) => void;
}

// Media source interface - making it more flexible to handle existing code
export interface MediaSource {
  url?: string;
  media_type?: MediaType;
  content_type?: string;
  creator_id?: string;
  duration?: number;
  width?: number;
  height?: number;
  poster?: string;
  media_url?: string;
  video_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  video_urls?: string[];
  media_urls?: string[];
  src?: string; // Add src property which is used in some components
}

// Upload options interface
export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  contentType?: string;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  bucketName?: string;
  maxFiles?: number;
}

export interface MediaRendererProps {
  src: string | MediaSource;
  type?: MediaType;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time?: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
  showWatermark?: boolean;
}

export interface UniversalMediaProps {
  item: string | MediaSource;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time?: number) => void;
  alt?: string;
  maxRetries?: number;
}

// Export the normalizeMediaSource utility directly from types
export const normalizeMediaSource = (source: string | any): MediaSource => {
  // If source is a string, treat it as a URL
  if (typeof source === 'string') {
    return { 
      url: source,
      media_type: MediaType.UNKNOWN
    };
  }
  
  // If it's null or undefined, return an empty object
  if (!source) {
    return { url: '', media_type: MediaType.UNKNOWN };
  }
  
  // Create a copy to avoid mutating the original
  const mediaSource: MediaSource = { ...source };
  
  // Set the url property based on available properties
  if (!mediaSource.url) {
    mediaSource.url = mediaSource.video_url || mediaSource.media_url || mediaSource.thumbnail_url || mediaSource.src || '';
  }
  
  return mediaSource;
}
