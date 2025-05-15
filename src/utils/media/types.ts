
/**
 * User availability status
 */
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  OFFLINE = "offline",
  INVISIBLE = "invisible"
}

/**
 * Media type enum for different content types
 */
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  OTHER = "other"
}

/**
 * Content visibility options
 */
export type ContentVisibility = 'public' | 'private' | 'subscribers_only' | 'followers_only';

/**
 * Content classification interface
 */
export interface ContentClassification {
  id: string;
  content_type: string;
  classification: string;
  visibility: string;
  created_at: string;
  age_restriction: boolean;
  requires_warning: boolean;
  warning_text?: string;
}
