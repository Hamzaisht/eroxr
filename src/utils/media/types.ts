// Define media types
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  UNKNOWN = "unknown"
}

// Updated AvailabilityStatus enum with uppercase constants 
// to match how it's being accessed in the components
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  INVISIBLE = "invisible",
  OFFLINE = "offline"
}

// Base MediaSource interface
export interface MediaSource {
  // Standard properties
  url: string;
  type: MediaType | string;
  
  // Optional standard properties
  creator_id?: string;
  contentCategory?: string;
  thumbnail_url?: string;
  poster?: string;
  
  // Legacy properties (for backward compatibility)
  media_url?: string | string[];
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  media_type?: MediaType | string;
  thumbnail?: string;
  content_type?: string;
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

// Availability status for media
export enum AvailabilityStatus {
  AVAILABLE = "available",
  PROCESSING = "processing",
  FAILED = "failed",
  REMOVED = "removed",
  RESTRICTED = "restricted"
}
