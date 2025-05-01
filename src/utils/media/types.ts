
// Media types
export enum MediaType {
  UNKNOWN = 'unknown',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  EMBED = 'embed',
  FILE = 'file'
}

// Media source interface
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
  poster?: string;
  media_type?: string | MediaType;
  content_type?: string;
  description?: string;
  title?: string;
  duration?: number;
}

// User presence status
export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

// Media Options interface
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

// File validation result
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Upload Options
export interface UploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  contentCategory?: string;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

// Upload state
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  files: File[];
  previews: string[];
  isComplete: boolean;
}

// Active Surveillance State
export interface ActiveSurveillanceState {
  isWatching: boolean;
  session: any | null;
  startTime: string;
  userId?: string;
}
