
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private', 
  SUBSCRIBERS = 'subscribers_only',
  PPV = 'ppv'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video', 
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  accessLevel: MediaAccessLevel;
  creatorId: string;
  creatorHandle?: string;
  ppvAmount?: number;
  postId?: string;
  thumbnailUrl?: string;
  duration?: number;
  alt?: string;
  metadata?: Record<string, any>;
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
  onAccessRequired?: (type: 'subscription' | 'purchase' | 'login') => void;
}

export interface AccessControlOverlayProps {
  accessLevel: MediaAccessLevel;
  creatorHandle?: string;
  ppvAmount?: number;
  isBlurred?: boolean;
  onUnlock?: () => void;
  onSubscribe?: () => void;
  onPurchase?: () => void;
}
