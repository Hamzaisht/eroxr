
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file'
}

export interface MediaItem {
  media_url: string;
  media_type: MediaType;
  thumbnail_url?: string;
  duration?: number;
  size?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  contentCategory: string;
  maxSizeInMB: number;
  allowedTypes: string[];
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  thumbnailUrl?: string;
}

export interface MediaUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  mediaUrl: string | null;
}
