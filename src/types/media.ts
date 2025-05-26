
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

export interface MediaItem {
  url: string;
  type: MediaType;
  creator_id?: string;
  thumbnail?: string;
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
  video_url?: string;
  thumbnail_url?: string;
  path?: string;
  post_id?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isComplete: boolean;
  result?: UploadResult;
}
