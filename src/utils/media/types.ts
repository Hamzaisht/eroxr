
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown',
}

export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SUBSCRIBERS = 'subscribers',
  PPV = 'ppv',
  INVISIBLE = 'invisible',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  PROCESSING = 'processing',
  ERROR = 'error',
  DELETED = 'deleted',
  EXPIRED = 'expired',
}

export interface MediaSource {
  url: string;
  type: MediaType;
  thumbnail?: string;
  poster?: string;
  duration?: number; 
  width?: number;
  height?: number;
  watermark?: boolean;
  creator_id?: string;
  content_type?: string;
  media_url?: string | string[];
  video_url?: string;
  thumbnail_url?: string;
  path?: string;
  access_level?: MediaAccessLevel;
  post_id?: string;
}

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface UploadOptions {
  path?: string;
  contentType?: string;
  maxSizeMB?: number;
  folder?: string;
  accessLevel?: MediaAccessLevel;
  contentCategory?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicUrl?: string;
  path?: string;
  error?: string;
  accessLevel?: MediaAccessLevel;
  contentCategory?: string;
}
