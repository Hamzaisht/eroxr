
/**
 * Media type enum for consistent type identification
 */
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Converts a string to MediaType enum value
 */
export function stringToMediaType(type: string | null | undefined): MediaType {
  if (!type) return MediaType.UNKNOWN;
  
  const normalizedType = type.toUpperCase();
  switch (normalizedType) {
    case 'IMAGE':
      return MediaType.IMAGE;
    case 'VIDEO':
      return MediaType.VIDEO;
    case 'AUDIO':
      return MediaType.AUDIO;
    case 'FILE':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
}

/**
 * Media source interface for flexible media handling
 */
export interface MediaSource {
  // Content URLs
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  url?: string;
  src?: string;
  
  // Media metadata
  media_type?: MediaType | string;
  content_type?: string;
  mime_type?: string;
  
  // Thumbnails and fallbacks
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  poster?: string;
  
  // Creator information
  creator_id?: string;
  
  // Media status
  is_loading?: boolean;
  has_error?: boolean;
}

/**
 * Media availability status
 */
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  PROCESSING = 'processing',
  FAILED = 'failed',
  RESTRICTED = 'restricted',
  UNKNOWN = 'unknown',
}

/**
 * Media error types
 */
export enum MediaErrorType {
  LOAD_FAILURE = 'load_failure',
  PROCESSING_ERROR = 'processing_error',
  PERMISSION_ERROR = 'permission_error',
  TIMEOUT = 'timeout',
  NETWORK_ERROR = 'network_error',
  UNKNOWN = 'unknown',
}

/**
 * Storage upload result
 */
export interface StorageUploadResult {
  success: boolean;
  url: string;
  path: string;
  error: string | null;
}

/**
 * Media options for media renderers and players
 */
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showControls?: boolean;
  allowFullscreen?: boolean;
  playOnHover?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
}
