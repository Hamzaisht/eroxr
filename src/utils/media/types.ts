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
  FOLLOWERS = 'followers',
  SUBSCRIBERS = 'subscribers',
  PPV = 'ppv',
  PRIVATE = 'private',
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible'
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
  post_id?: string;
  access_level?: MediaAccessLevel; // Added access level
  path?: string; // Adding path property to fix the TS error
}

export interface MediaOptions {
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
  className?: string;
}

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  accessLevel?: MediaAccessLevel;
  postId?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicUrl?: string;
  path?: string;
  accessLevel?: MediaAccessLevel; // Added this property to fix the type error
  signedUrl?: string; // Added for secure URL access
}
