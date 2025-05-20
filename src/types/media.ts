
/**
 * Media types for the application
 */
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  GIF = "gif",
  UNKNOWN = "unknown"
}

/**
 * User availability status
 */
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  INVISIBLE = "invisible",
  OFFLINE = "offline"
}

/**
 * Media source interface for universal media component
 */
export interface MediaSource {
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
  media_type?: string;
  thumbnail?: string;
  content_type?: string;
}

/**
 * Media options interface for media components
 */
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
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
