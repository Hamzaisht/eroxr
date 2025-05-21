
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  GIF = 'gif',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export enum MediaAccessLevel {
  PUBLIC = 'public',
  FOLLOWERS = 'followers',
  SUBSCRIBERS = 'subscribers',
  PPV = 'ppv',
  PRIVATE = 'private'
}

export interface MediaSource {
  url: string;
  type: MediaType;
  creator_id?: string;
  access_level?: MediaAccessLevel;
  poster?: string;
  thumbnail?: string;
  post_id?: string;
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
}
