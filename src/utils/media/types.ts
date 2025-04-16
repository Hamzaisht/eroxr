
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string;
  media_url?: string | null;
  media_urls?: string[] | null;
  video_url?: string | null;
  video_urls?: string[] | null;
  url?: string | null;
  src?: string | null;
  type?: string;
  media_type?: string;
  content_type?: string;
  creator_id?: string; // Added creator_id property
  poster_url?: string;
}

export interface MediaResult {
  url: string | null;
  type: MediaType;
  contentType: string;
  isError: boolean;
  errorMessage?: string;
  isLoading?: boolean; // Added for the useMedia hook
  retryCount?: number; // Added for the useMedia hook
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Add MediaOptions interface for media components
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

// Add Upload related types
export interface UploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  contentCategory?: 'story' | 'post' | 'message' | 'profile' | 'avatar' | 'short' | 'generic';
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
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

// Define AvailabilityStatus types
export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'idle' | 'dnd';
