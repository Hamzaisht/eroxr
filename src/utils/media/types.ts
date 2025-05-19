
export enum AvailabilityStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
  BUSY = "busy",
  INVISIBLE = "invisible"
}

export interface MediaType {
  VIDEO: "video";
  IMAGE: "image";
  AUDIO: "audio";
  PDF: "pdf";
  UNKNOWN: "unknown";
}

export interface MediaSource {
  url: string;
  media_type?: string;
  thumbnail?: string;
  poster?: string;
  content_type?: string;
  duration?: number;
}

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
  onError?: (error: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  alt?: string;
  maxRetries?: number;
}
