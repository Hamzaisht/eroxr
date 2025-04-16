
/**
 * Types for media-related data
 */

export type MediaType = 'image' | 'video' | 'audio' | 'unknown';

export type AvailabilityStatus = 'online' | 'away' | 'busy' | 'offline';

export interface MediaSource {
  video_url?: string;
  media_url?: string;
  thumbnail_url?: string;
  creator_id?: string;
  media_type?: MediaType;
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
