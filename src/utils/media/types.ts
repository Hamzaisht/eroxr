
export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  UNKNOWN = "UNKNOWN"
}

export interface MediaSource {
  id?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  video_thumbnail_url?: string;
  creator_id?: string;
  url?: string;
  poster?: string;
  media_type?: MediaType | string;
  content_type?: string;
}

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}
