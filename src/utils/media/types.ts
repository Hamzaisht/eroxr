
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
  media_type?: MediaType | string;
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
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  allowedTypes?: string[];
  bucket?: string;
  path?: string;
  contentType?: string;
  contentCategory?: string;
  cacheControl?: string;
  upsert?: boolean;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Upload state tracking
 */
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url?: string | null;
  success?: boolean;
  files?: any[];
  previews?: string[];
  isComplete?: boolean;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  isValid?: boolean; // Alias for backward compatibility
  error?: string;
  message?: string; // Alias for error
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
  deviceId?: string | null;
  startTime: number | string | null;
  userId?: string;
  targetUserId?: string;
  startedAt?: Date;
  duration?: number;
  sessionId?: string;
  isWatching?: boolean;
  session?: any;
}

/**
 * Create a function to safely convert strings to AvailabilityStatus
 */
export function stringToAvailabilityStatus(status: string): AvailabilityStatus {
  switch(status.toLowerCase()) {
    case 'online': return AvailabilityStatus.ONLINE;
    case 'away': return AvailabilityStatus.AWAY;
    case 'busy': return AvailabilityStatus.BUSY;
    case 'invisible': return AvailabilityStatus.INVISIBLE;
    case 'offline':
    default:
      return AvailabilityStatus.OFFLINE;
  }
}

/**
 * Helper function to check if a value is a valid AvailabilityStatus
 */
export function isValidAvailabilityStatus(status: any): boolean {
  return Object.values(AvailabilityStatus).includes(status as AvailabilityStatus);
}

// Add a function to help convert to MediaType enum values
export function stringToMediaType(type: string): MediaType {
  switch(type.toLowerCase()) {
    case 'image': return MediaType.IMAGE;
    case 'video': return MediaType.VIDEO;
    case 'audio': return MediaType.AUDIO;
    case 'document': return MediaType.DOCUMENT;
    case 'embed': return MediaType.EMBED;
    case 'file': return MediaType.FILE;
    default: return MediaType.UNKNOWN;
  }
}
