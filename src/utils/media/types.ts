
import { MediaSource as GlobalMediaSource, MediaType } from '@/types/media';

export { MediaType };

export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  OFFLINE = "offline",
  INVISIBLE = "invisible"
}

// Extend the global MediaSource with backward compatibility properties
export interface MediaSource extends GlobalMediaSource {
  // These are for backward compatibility and should be phased out
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  creator_id?: string;
  media_type?: MediaType;
}

export type MediaOptions = {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  showCloseButton?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export type UniversalMediaProps = {
  item: MediaSource | string;
  alt?: string;
  maxRetries?: number;
} & MediaOptions;

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
  fileType?: string;
  metadata?: Record<string, any>;
}
