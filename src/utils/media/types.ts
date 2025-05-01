
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  FILE = "FILE",  // Adding FILE type that was missing
  UNKNOWN = "UNKNOWN"
}

export enum AvailabilityStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
  BUSY = "busy",
  INVISIBLE = "invisible"
}

export interface MediaSource {
  id?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  creator_id?: string;
  url?: string;
  src?: string; // Adding src property that was missing
  poster?: string;
  media_type?: MediaType | string;
  content_type?: string;
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

// Add missing types for upload functionality
export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  compressionOptions?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
  // Add missing properties used in components
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  // Add missing properties used in components
  success?: boolean;
  isComplete?: boolean;
  files?: File[];
  previews?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Add types for surveillance and ghost mode
export interface ActiveSurveillanceState {
  active: boolean;
  userId?: string;
  targetUserId?: string;
  target?: string;
  startTime?: string;
}

export interface LiveAlert {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  user_id?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Helper function to convert string to MediaType
export function stringToMediaType(type: string): MediaType {
  type = type.toUpperCase();
  switch (type) {
    case 'IMAGE':
      return MediaType.IMAGE;
    case 'VIDEO':
      return MediaType.VIDEO;
    case 'AUDIO':
      return MediaType.AUDIO;
    case 'DOCUMENT':
      return MediaType.DOCUMENT;
    case 'FILE':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
}
