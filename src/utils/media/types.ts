
/**
 * Media utility type definitions
 */

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: string) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

// Generic media source interface
export interface MediaSource {
  media_url?: string;
  video_url?: string;
  image_url?: string;
  url?: string;
  src?: string;
  media_type?: string;
  content_type?: string;
  creator_id?: string;
  id?: string;
  media_urls?: string[];
  video_urls?: string[];
  thumbnail_url?: string; // Added for thumbnail support
}

// Upload related types
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
  url: string;
  path: string;
  size: number;
  contentType: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  isComplete: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  message: string;
}
