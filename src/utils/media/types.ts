
/**
 * Represents various types of media sources that can be used across the app
 */
export interface MediaSource {
  url?: string;
  media_url?: string;
  video_url?: string;
  media_urls?: string[];
  video_urls?: string[];
}

/**
 * Supported media types
 */
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'unknown';

/**
 * Options for media playback
 */
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
