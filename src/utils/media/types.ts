
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown',
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible',
}

export interface MediaSource {
  url: string;
  type: MediaType;
  thumbnail?: string;
  poster?: string;
  duration?: number; 
  width?: number;
  height?: number;
  watermark?: boolean;
  creator_id?: string;
  content_type?: string;
  media_url?: string | string[];
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
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface UploadOptions {
  maxSizeInMB?: number;
  contentCategory?: string;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

/**
 * Calculate dimensions while maintaining aspect ratio
 */
export const calculateAspectRatioDimensions = (
  aspectRatio: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { width, height };
};

/**
 * Process media URL to make it playable
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Add cache busting parameter if needed
  const hasCacheBuster = url.includes('_cb=');
  if (!hasCacheBuster) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${Date.now()}`;
  }
  
  return url;
};
