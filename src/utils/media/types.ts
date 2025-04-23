
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  TEXT = 'text',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaItem {
  media_url: string;
  media_type: MediaType;
}

export interface MediaSource {
  media_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  media_type?: MediaType | string;
  creator_id?: string;
  content_type?: string;
  [key: string]: any; // Allow for additional properties
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
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

export interface ActiveSurveillanceState {
  active: boolean;
  userId: string;
  targetUserId: string;
  startedAt: Date | undefined;
  duration: number;
  sessionId: string;
  isWatching: boolean;
  session: any | null;
  startTime: string | null;
}
