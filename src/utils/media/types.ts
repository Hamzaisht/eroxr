
/**
 * Media types and interfaces for the application
 */

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  UNKNOWN = "unknown"
}

export interface MediaSource {
  media_url?: string | null | string[];
  video_url?: string | null;
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
}

export interface MediaResult {
  url: string | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  mediaType: MediaType;
}

export interface UploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic' | 'avatar';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  file: File | null;
}

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}
