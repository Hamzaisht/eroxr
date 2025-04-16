
/**
 * Types for media handling
 */

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string | number;
  url?: string;
  src?: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  media_type?: string;
  content_type?: string;
  type?: string;
  [key: string]: any;
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

export interface UploadOptions {
  contentCategory?: 'post' | 'story' | 'avatar' | 'message' | 'ad' | 'cover' | 'generic' | 'short' | 'profile';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  file: File | null;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Use namespace instead of duplicate enum
export namespace AvailabilityStatusValues {
  export const AVAILABLE = 'online';
  export const PENDING = 'away';
  export const RESTRICTED = 'busy';
  export const PREMIUM = 'premium';
  export const DELETED = 'deleted';
}
