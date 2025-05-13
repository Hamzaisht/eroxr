
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

export interface MediaSource {
  url?: string;
  src?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  media_type?: MediaType | string;
  creator_id?: string;
  [key: string]: any;
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

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onError?: () => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: StorageUploadResult | null;
  files: File[];
  previews: string[];
  isComplete: boolean;
  success: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  message?: string;
}

export interface StorageUploadResult {
  success: boolean;
  path: string;
  url: string;
  error: string | null;
}

// Helper function to convert string to MediaType
export function stringToMediaType(type: string): MediaType {
  type = type.toLowerCase();
  switch (type) {
    case 'video':
    case 'mp4':
    case 'webm':
    case 'mov':
      return MediaType.VIDEO;
    case 'image':
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return MediaType.IMAGE;
    case 'gif':
      return MediaType.GIF;
    case 'audio':
    case 'mp3':
    case 'wav':
      return MediaType.AUDIO;
    case 'file':
    case 'pdf':
    case 'doc':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
}
