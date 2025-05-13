
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  url?: string;
  src?: string;
  media_url?: string;
  media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  thumbnail_url?: string;
  media_type?: MediaType | string;
  creator_id?: string;
  [key: string]: any;
}

export interface UploadOptions {
  contentCategory?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: StorageUploadResult | null;
  files: File[];
  previews: string[];
  isComplete: boolean;
  success: boolean;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface StorageUploadResult {
  success: boolean;
  path: string;
  url: string;
  error: string | null;
}
