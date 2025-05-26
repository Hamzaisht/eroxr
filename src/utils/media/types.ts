
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SUBSCRIBERS_ONLY = 'subscribers_only',
  SUBSCRIBERS = 'subscribers',
  PPV = 'ppv',
  FOLLOWERS = 'followers'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  PENDING = 'pending',
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadOptions {
  accessLevel?: MediaAccessLevel;
  category?: string;
  metadata?: Record<string, any>;
  altText?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  thumbnailUrl?: string;
  alt?: string;
  creatorId: string;
  creatorHandle?: string;
  postId?: string;
  accessLevel: MediaAccessLevel;
  ppvAmount?: number;
}

export interface MediaRendererProps {
  media: MediaItem;
  className?: string;
  showWatermark?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: () => void;
}
