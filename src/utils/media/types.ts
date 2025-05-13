
// Types for media handling
export enum MediaType {
  UNKNOWN = 'unknown',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  GIF = 'gif',
  DOCUMENT = 'document',
  FILE = 'file' 
}

export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible'
}

export interface MediaSource {
  // Required field to store the URL
  url?: string;
  
  // Legacy fields for backward compatibility
  video_url?: string;
  media_url?: string;
  src?: string;
  
  // Additional metadata fields
  media_type?: MediaType;
  thumbnail_url?: string;
  creator_id?: string;
  content_type?: string;
  poster?: string;
  
  // Arrays for multiple URLs
  video_urls?: string[];
  media_urls?: string[];
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
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  maxRetries?: number;
  showWatermark?: boolean;
}

export type MediaTypes = 'image' | 'video' | 'audio' | 'document' | 'all';

// Helper function to convert string to MediaType
export function stringToMediaType(str: string): MediaType {
  switch (str.toLowerCase()) {
    case 'image':
      return MediaType.IMAGE;
    case 'video':
      return MediaType.VIDEO;
    case 'audio':
      return MediaType.AUDIO;
    case 'gif':
      return MediaType.GIF;
    case 'document':
      return MediaType.DOCUMENT;
    case 'file':
      return MediaType.FILE;
    default:
      return MediaType.UNKNOWN;
  }
}

// Upload related types
export interface UploadOptions {
  bucket?: string;
  path?: string;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  generateThumbnail?: boolean;
  addWatermark?: boolean;
  isPublic?: boolean;
  metadata?: Record<string, any>;
  contentCategory?: string;
  maxSizeInMB?: number;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

// Normalize a media source to ensure it has a valid URL property
export function normalizeMediaSource(source: string | MediaSource): MediaSource {
  if (typeof source === 'string') {
    return { url: source };
  }
  
  const normalizedSource: MediaSource = { ...source };
  
  // Ensure the url property is set
  if (!normalizedSource.url) {
    if (normalizedSource.video_url) {
      normalizedSource.url = normalizedSource.video_url;
    } else if (normalizedSource.media_url) {
      normalizedSource.url = normalizedSource.media_url;
    } else if (normalizedSource.src) {
      normalizedSource.url = normalizedSource.src;
    }
  }
  
  return normalizedSource;
}
