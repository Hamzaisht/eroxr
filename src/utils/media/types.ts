
/**
 * Types for media handling
 */

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string | number;
  url?: string;
  src?: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
  media_type?: string;
  content_type?: string;
  type?: string;
  [key: string]: any;
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
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface UploadOptions {
  contentCategory?: 'post' | 'story' | 'avatar' | 'message' | 'ad' | 'cover' | 'generic';
  maxSizeInMB?: number;
  allowedTypes?: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  RESTRICTED = 'restricted',
  PREMIUM = 'premium',
  DELETED = 'deleted',
}
