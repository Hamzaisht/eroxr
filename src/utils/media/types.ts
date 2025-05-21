
/**
 * Media access level enumeration
 */
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PAID = 'paid',
  SUBSCRIBER = 'subscriber',
  FOLLOWERS = 'followers',
  PPV = 'ppv'
}

/**
 * Media type enumeration
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

/**
 * User availability status
 */
export enum AvailabilityStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible'
}

/**
 * Media source interface
 */
export interface MediaSource {
  url: string;
  type: MediaType;
  poster?: string;
  creator_id?: string;
  post_id?: string;
  access_level?: MediaAccessLevel;
  path?: string;
  thumbnail?: string;
  watermark?: boolean;
  duration?: number;
  width?: number;
  height?: number;
  content_type?: string;
}

/**
 * Upload options interface
 */
export interface UploadOptions {
  bucket?: string;
  path?: string;
  contentType?: string;
  maxSizeMB?: number;
  folder?: string;
  accessLevel?: MediaAccessLevel;
  contentCategory?: string; // Add this field
}

/**
 * Upload result interface
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  publicUrl?: string;
  path?: string;
  error?: string;
  accessLevel?: MediaAccessLevel;
}

/**
 * Media item interface
 */
export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  creator_id?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Media options for rendering
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
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (e: any) => void;
}
