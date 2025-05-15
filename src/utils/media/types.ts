
// Status enumeration for availability indicators
export enum AvailabilityStatus {
  ONLINE = "Online",
  AWAY = "Away",
  BUSY = "Busy",
  INVISIBLE = "Invisible",
  OFFLINE = "Offline"
}

// Media type enumeration for different content types
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  GIF = "gif",
  UNKNOWN = "unknown"
}

// Type definition for media sources
export interface MediaSource {
  url?: string;
  media_url?: string;
  video_url?: string;
  audio_url?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  poster?: string;
  content_type?: string;
  media_type?: MediaType;
  creator_id?: string;
}

// Options for media components
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
  onTimeUpdate?: () => void;
}

// Props for media renderer component
export interface MediaRendererProps extends MediaOptions {
  src: MediaSource | string;
  type?: MediaType;
  allowRetry?: boolean;
  maxRetries?: number;
  showWatermark?: boolean;
}

// Props for universal media component
export interface UniversalMediaProps {
  item: MediaSource | string;
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
  onTimeUpdate?: () => void;
  alt?: string;
  maxRetries?: number;
}
