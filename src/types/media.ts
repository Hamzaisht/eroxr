
// Define media types
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  UNKNOWN = "unknown"
}

// Base MediaSource interface
export interface MediaSource {
  url: string;
  type: MediaType | string;
  creator_id?: string;
  contentCategory?: string;
  thumbnail_url?: string;
  poster?: string;
  // These properties are for backward compatibility
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  media_type?: MediaType | string;
  thumbnail?: string;
}

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  showWatermark?: boolean;
  showCloseButton?: boolean;
  creatorId?: string;
  onClose?: () => void;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
  fileType?: string;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  folderPath?: string;
  bucket?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
  contentCategory?: string;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}
