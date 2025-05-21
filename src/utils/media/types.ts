
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown',
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
  maxSizeInMB?: number;
  contentCategory?: string;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}
