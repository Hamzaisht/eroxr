
/**
 * Media type enum
 */
export enum MediaType {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

/**
 * Media source interface
 */
export interface MediaSource {
  media_url?: string | null;
  media_urls?: string[] | null;
  video_url?: string | null;
  video_urls?: string[] | null;
  url?: string | null;
  src?: string | null;
  creator_id?: string | null;
  media_type?: string | null;
  content_type?: string | null;
  poster_url?: string | null; // Add missing poster_url property
}

/**
 * Media result interface
 */
export interface MediaResult {
  url: string | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  mediaType: MediaType;
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
 * Upload options interface
 */
export interface UploadOptions {
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'short' | 'generic' | 'avatar';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
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
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Media options interface for video/image components
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
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}
