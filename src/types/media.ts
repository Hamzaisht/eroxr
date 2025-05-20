
export enum MediaType {
  IMAGE = "image",
  GIF = "gif",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  UNKNOWN = "unknown"
}

export interface MediaSource {
  url: string;
  type: MediaType;
  thumbnail?: string;
  poster?: string;
  creator_id?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
  mimeType?: string;
  createdAt?: string;
  modifiedAt?: string;
}

export interface MediaInfo {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'unknown';
  metadata?: MediaMetadata;
  thumbnail?: string;
}

/**
 * Result type for media upload operations
 */
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  result?: UploadResult;
}
