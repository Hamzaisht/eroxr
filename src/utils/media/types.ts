
/**
 * Enumeration of different availability statuses for users
 */
export enum AvailabilityStatus {
  ONLINE = "online",
  AWAY = "away",
  BUSY = "busy",
  OFFLINE = "offline",
  INVISIBLE = "invisible"
}

/**
 * Interface for media items
 */
export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  caption?: string;
  thumbnailUrl?: string;
}

/**
 * Interface for upload progress
 */
export interface UploadProgress {
  percentage: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}
