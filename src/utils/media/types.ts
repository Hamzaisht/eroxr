
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

export enum MediaAccessLevel {
  PUBLIC = 'public',
  SUBSCRIBERS = 'subscribers',
  PPV = 'ppv',
  FOLLOWERS = 'followers',
  PRIVATE = 'private'
}

export interface MediaItem {
  id?: string;
  url: string;
  type: MediaType;
  alt?: string;
  access_level?: MediaAccessLevel;
}

export interface MediaRendererProps {
  media: MediaItem;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showWatermark?: boolean;
  onAccessRequired?: (type: 'subscription' | 'purchase' | 'login') => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  assetId?: string;
}

export type AvailabilityStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';
