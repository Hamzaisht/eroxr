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
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
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
  contentCategory?: string; // Added to support different upload contexts
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
  isComplete?: boolean; // Added for compatibility
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
 * Using string literal union type instead of enum to allow string literals
 */
export type AvailabilityStatus = 'online' | 'away' | 'busy' | 'offline' | 'invisible';

// For backwards compatibility, also keep the enum
export enum AvailabilityStatusEnum {
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
  startTime: string | null; // Changed to string only for consistency
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
    case 'online': return 'online';
    case 'away': return 'away';
    case 'busy': return 'busy';
    case 'invisible': return 'invisible';
    case 'offline':
    default:
      return 'offline';
  }
}

/**
 * Helper function to check if a value is a valid AvailabilityStatus
 */
export function isValidAvailabilityStatus(status: any): status is AvailabilityStatus {
  return ['online', 'away', 'busy', 'offline', 'invisible'].includes(status);
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
