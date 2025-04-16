
/**
 * Media types and interfaces
 */

export enum MediaType {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string;
  video_url?: string;
  video_urls?: string[];
  media_url?: string;
  media_urls?: string[];
  url?: string;
  src?: string;
  content_type?: string;
  media_type?: string;
  creator_id?: string;
  [key: string]: any;
}

export interface MediaOptions {
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  ERROR = 'error'
}

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}
