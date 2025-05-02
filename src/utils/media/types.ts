
/**
 * Represents various types of media sources that can be used across the app
 */
export interface MediaSource {
  url?: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  creator_id?: string;
  thumbnail_url?: string;
  media_type?: MediaType;
  src?: string;
}

/**
 * Supported media types
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

/**
 * User availability status
 */
export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

/**
 * Options for media playback
 */
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

/**
 * Options for media upload
 */
export interface UploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  compress?: boolean;
  compressOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  };
}

/**
 * Convert string to MediaType
 */
export const stringToMediaType = (type?: string): MediaType => {
  if (!type) return MediaType.UNKNOWN;
  
  switch (type.toLowerCase()) {
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return MediaType.IMAGE;
    case 'video':
    case 'mp4':
    case 'webm':
    case 'mov':
      return MediaType.VIDEO;
    case 'audio':
    case 'mp3':
    case 'wav':
    case 'ogg':
      return MediaType.AUDIO;
    case 'document':
    case 'pdf':
    case 'doc':
    case 'docx':
      return MediaType.DOCUMENT;
    default:
      return MediaType.UNKNOWN;
  }
};
