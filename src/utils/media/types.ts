
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  OFFLINE = "offline",
  INVISIBLE = "invisible"
}

export interface MediaSource {
  url: string;
  type: MediaType;
  poster?: string;
  thumbnail?: string;
  // Additional properties for backward compatibility
  media_url?: string | string[];
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  creator_id?: string;
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  UNKNOWN = "unknown"
}

export type MediaOptions = {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export type UniversalMediaProps = {
  item: MediaSource | string;
} & MediaOptions;

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
  fileType?: string;
  metadata?: Record<string, any>;
}
