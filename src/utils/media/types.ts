
/**
 * Media utility type definitions
 */

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  UNKNOWN = 'unknown'
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
  onError?: (error?: string) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

// Generic media source interface
export interface MediaSource {
  media_url?: string;
  video_url?: string;
  image_url?: string;
  url?: string;
  src?: string;
  media_type?: string;
  content_type?: string;
  creator_id?: string;
  id?: string;
  media_urls?: string[];
  video_urls?: string[];
}
