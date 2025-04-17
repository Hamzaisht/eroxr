
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
  onError?: () => void;
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
  video_thumbnail_url?: string; // Added this property
  creator_id?: string;
  content_type?: string;
  media_type?: MediaType | string;
  duration?: number;
  type?: string; // Added this property
}

export type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  isComplete?: boolean; // Added this property
};

export interface UploadOptions {
  bucket?: string;
  path?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  contentCategory?: string; // Added this property
  autoResetOnCompletion?: boolean; // Added this property
  resetDelay?: number; // Added this property
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
  success?: boolean; // Added this property
  error?: string; // Added this property
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  message?: string; // Added this property for backward compatibility
}

// Alias for backward compatibility
export type UseMediaOptions = MediaOptions;
