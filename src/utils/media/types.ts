
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string;
  media_url?: string | string[] | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  media_type?: MediaType;
  creator_id?: string;
  duration?: number;
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
