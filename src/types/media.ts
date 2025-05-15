
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
