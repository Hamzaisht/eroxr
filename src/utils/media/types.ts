
/**
 * Media type enumeration
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

/**
 * Availability status type
 */
export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy';

/**
 * Media source interface - allows for various media source formats
 */
export interface MediaSource {
  id?: string | number;
  url?: string;
  src?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  media_type?: string;
  content_type?: string;
  creator_id?: string;
  [key: string]: any;
}

/**
 * Media options for rendering
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
 * Upload result interface
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload options interface
 */
export interface UploadOptions {
  contentCategory?: 'post' | 'story' | 'message' | 'short' | 'avatar' | 'profile' | 'generic';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

/**
 * Upload state interface
 */
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  file: File | null;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  message?: string;
}
