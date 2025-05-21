
/**
 * Media access level enumeration
 */
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PAID = 'paid',
  SUBSCRIBER = 'subscriber'
}

/**
 * Media type enumeration
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
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
