
/**
 * Enumeration of different media types for the application
 */
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video", 
  AUDIO = "audio",
  GIF = "gif",
  UNKNOWN = "unknown"
}

/**
 * Enumeration of different availability statuses for users
 */
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  OFFLINE = "offline",
  INVISIBLE = "invisible"
}

/**
 * Interface for media items
 */
export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  caption?: string;
  thumbnailUrl?: string;
}

/**
 * Interface for media source
 */
export interface MediaSource {
  url?: string;
  media_url?: string;
  video_url?: string;
  thumbnail?: string;
  poster?: string;
  media_type?: MediaType;
  content_type?: string;
  creator_id?: string;
}

/**
 * Interface for media render options
 */
export interface MediaOptions {
  quality?: number;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  onError?: () => void;
}

/**
 * Interface for media renderer props
 */
export interface MediaRendererProps {
  src: MediaSource | string;
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
  alt?: string;
}

/**
 * Interface for universal media props
 */
export interface UniversalMediaProps {
  item: MediaSource | string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time?: number) => void;
  alt?: string;
  maxRetries?: number;
}

/**
 * Interface for upload progress
 */
export interface UploadProgress {
  percentage: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}
