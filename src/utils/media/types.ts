
/**
 * Media type definitions
 */

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  media_url?: string;
  video_url?: string;
  video_urls?: string[];
  media_urls?: string[];
  video_thumbnail_url?: string;
  thumbnail_url?: string;
  url?: string;
  src?: string;
  creator_id?: string;
  media_type?: MediaType | string;
  content_type?: string;
  type?: string;
}

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

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

export interface UseMediaOptions {
  onComplete?: () => void;
  onError?: () => void;
  onProgress?: (progress: number) => void;
}

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
  error: string | null;
  success?: boolean;  // Add success property to fix the errors
}

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}
