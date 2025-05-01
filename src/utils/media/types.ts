
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
  media_url?: string | string[];
  media_urls?: string[];
  video_url?: string | string[];
  video_urls?: string[];
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  poster?: string;
  media_type?: string | MediaType;
  content_type?: string;
  description?: string;
  title?: string;
  duration?: number;
  creator_id?: string;
}

// Helper function to convert string to MediaType enum
export function stringToMediaType(typeString: string | undefined): MediaType {
  if (!typeString) return MediaType.UNKNOWN;
  
  const lowerType = typeString.toLowerCase();
  
  switch (lowerType) {
    case 'image':
      return MediaType.IMAGE;
    case 'video':
      return MediaType.VIDEO;
    case 'audio':
      return MediaType.AUDIO;
    case 'document':
      return MediaType.DOCUMENT;
    case 'embed':
      return MediaType.EMBED;
    case 'file':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
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
  active?: boolean;
  targetUserId?: string;
  startedAt?: Date;
  duration?: number;
  sessionId?: string;
  deviceId?: any;
}

// LiveAlert and LiveSession types must match the ones in types/alerts.ts and types/surveillance.ts
export interface LiveAlert {
  id: string;
  type: string;
  alert_type: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  created_at: string;
  content_type: string;
  reason?: string;
  severity: 'high' | 'medium' | 'low';
  content_id?: string;
  message: string;
  status: string;
  title: string;
  description?: string;
  is_viewed: boolean;
  urgent: boolean;
  session?: LiveSession;
  reporter?: {
    id: string;
    username?: string;
    avatar_url?: string | null;
  };
}

export interface LiveSession {
  id: string;
  userId?: string;
  username?: string;
  deviceId?: string;
  device_id?: string;
  startTime?: Date;
  active?: boolean;
  user_id?: string;
  type?: string;
  created_at?: string;
  media_url?: string | string[];
}
