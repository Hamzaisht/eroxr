
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
  video_url?: string;
  thumbnail_url?: string; // Adding this property to fix EroboardCard
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
  onTimeUpdate?: (e: any) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
  fileType?: string;
  metadata?: Record<string, any>;
}
