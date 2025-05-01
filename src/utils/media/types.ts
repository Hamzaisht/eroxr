
// Media types
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  UNKNOWN = 'unknown'
}

// User availability status for profile and messaging
export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

// Source object interface for media
export interface MediaSource {
  id?: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  url?: string;
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  media_type?: MediaType | string;
  content_type?: string;
  creator_id?: string;
  [key: string]: any;
}

// Options for media components
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

// Upload options
export interface UploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onComplete?: (url: string) => void;
  onError?: (error: string) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  contentCategory?: string;
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

// File validation result
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Export additional types used by the mediaUtils system
export interface PlaybackOptions {
  startTime?: number;
  volume?: number;
  muted?: boolean;
}

export interface MediaMetadata {
  dimensions?: { width: number; height: number };
  duration?: number;
  size?: number;
  type?: string;
}

// Ghost mode / surveillance related types
export interface ActiveSurveillanceState {
  active: boolean;
  target?: string;
  startTime?: string;
  userId?: string;
  targetUserId?: string;
  duration?: number;
  sessionId?: string;
  isWatching?: boolean;
  session?: any;
  startedAt?: Date;
}

export interface LiveAlert {
  id: string;
  type: string;
  content: string;
  created_at: string;
  user_id: string;
  session?: any;
}

// Helper function to convert string to MediaType
export const stringToMediaType = (type: string): MediaType => {
  if (!type) return MediaType.UNKNOWN;
  
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('image')) return MediaType.IMAGE;
  if (lowerType.includes('video')) return MediaType.VIDEO;
  if (lowerType.includes('audio')) return MediaType.AUDIO;
  if (lowerType.includes('file') || lowerType.includes('document')) return MediaType.FILE;
  
  return MediaType.UNKNOWN;
};
