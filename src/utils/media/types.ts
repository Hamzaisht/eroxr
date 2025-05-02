
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  UNKNOWN = 'unknown'
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

export interface MediaItem {
  media_url: string;
  media_type: MediaType;
  thumbnail_url?: string;
  duration?: number;
  size?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  contentCategory: string;
  maxSizeInMB: number;
  allowedTypes: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  thumbnailUrl?: string;
}

export interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  mediaUrl: string | null;
}

export interface MediaSource {
  creator_id?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  poster?: string;
  video_thumbnail_url?: string;
  media_type?: MediaType | string;
  url?: string;
  src?: string;
}

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

// Additional types needed for hooks
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  files: File[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface ActiveSurveillanceState {
  isActive: boolean;
  lastUpdated: Date | null;
}

export interface LiveAlert {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

// Convert string to MediaType enum
export function stringToMediaType(typeStr: string): MediaType {
  switch (typeStr.toLowerCase()) {
    case 'image':
      return MediaType.IMAGE;
    case 'video':
      return MediaType.VIDEO;
    case 'audio':
      return MediaType.AUDIO;
    case 'file':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
}
