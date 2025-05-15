
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
