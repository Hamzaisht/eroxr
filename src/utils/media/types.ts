

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
  onError?: (error?: string) => void;  // Updated to accept an optional error parameter
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface MediaSource {
  id?: string;
  url?: string;
  src?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  creator_id?: string;
  content_type?: string;
  media_type?: MediaType | string;
  duration?: number;
  type?: string;
}

export type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  isComplete?: boolean;
};

export interface UploadOptions {
  bucket?: string;
  path?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  contentCategory?: string;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
  success?: boolean;
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  message?: string;
}

// Alias for backward compatibility
export type UseMediaOptions = MediaOptions;
