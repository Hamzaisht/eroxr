
/**
 * Media type enum
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown',
  GIF = 'gif'
}

/**
 * Media source interface
 */
export interface MediaSource {
  url: string;
  type: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  creator_id?: string;
  media_type?: string;
  thumbnail?: string;
  poster?: string;
  thumbnail_url?: string;
  contentCategory?: string;
  content_type?: string;
}

/**
 * Upload result interface
 */
export interface UploadResult {
  url: string;
  path: string;
  fileType: string;
  fileName: string;
  error?: string;
  success: boolean;
}

/**
 * Media options interface
 */
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}
