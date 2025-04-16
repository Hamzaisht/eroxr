
/**
 * Media types and interfaces
 */

export enum MediaType {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy';

export interface MediaSource {
  id?: string;
  video_url?: string;
  video_urls?: string[];
  media_url?: string;
  media_urls?: string[];
  url?: string;
  src?: string;
  content_type?: string;
  media_type?: string;
  creator_id?: string;
  [key: string]: any;
}

export interface MediaOptions {
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
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
  success?: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}
