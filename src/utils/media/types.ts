
/**
 * Types for media-related data
 */

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export type AvailabilityStatus = 'online' | 'away' | 'busy' | 'offline';

export interface MediaSource {
  video_url?: string;
  media_url?: string;
  thumbnail_url?: string;
  creator_id?: string;
  media_type?: MediaType | string; // Allow string for backward compatibility
  content_type?: string;
  // Additional properties needed by various components
  url?: string;
  src?: string;
  video_urls?: string[];
  media_urls?: string[];
  poster_url?: string;
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
  bucket?: string;
  folder?: string;
  userId?: string;
  onProgress?: (progress: number) => void;
  onComplete?: (url: string) => void;
  onError?: (error: Error) => void;
}
