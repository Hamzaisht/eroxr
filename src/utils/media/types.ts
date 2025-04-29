
/**
 * Types for media handling
 */

export enum MediaType {
  UNKNOWN = 'unknown',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  EMBED = 'embed',
  FILE = 'file'
}

/**
 * Media source can be a string URL or an object with various properties
 * This interface aims to accommodate different source formats
 */
export interface MediaSource {
  // Basic properties
  url?: string;
  src?: string;
  
  // Specific media URLs
  media_url?: string | null;
  video_url?: string | null;
  media_urls?: string[] | null;
  video_urls?: string[] | null;
  
  // Media metadata
  media_type?: MediaType;
  content_type?: string;
  thumbnail_url?: string | null;
  video_thumbnail_url?: string | null;
  poster?: string | null;
  
  // Creator info
  creator_id?: string;
  
  // Any other properties
  [key: string]: any;
}

/**
 * Options for media components
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
  showWatermark?: boolean;
}

/**
 * Options for media uploads
 */
export interface UploadOptions {
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  bucket?: string;
  path?: string;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

/**
 * Upload state tracking
 */
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * User availability status
 */
export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible'
}

/**
 * Active surveillance state
 */
export interface ActiveSurveillanceState {
  active: boolean;
  deviceId: string | null;
  startTime: number | null;
}
