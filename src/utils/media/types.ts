
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

export interface MediaSource {
  url?: string;
  video_url?: string;
  media_url?: string;
  thumbnail_url?: string;
  poster?: string;
  media_type?: MediaType | string;
  type?: string;
  src?: string;
  creator_id?: string;
  video_urls?: string[];
  media_urls?: string[];
}

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  maxRetries?: number;
  allowRetry?: boolean;
}

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export function stringToMediaType(type: string): MediaType {
  switch (type?.toLowerCase()) {
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
      return MediaType.UNKNOWN;
  }
}
