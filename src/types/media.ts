
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  GIF = 'gif',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  url: string;
  type: MediaType;
  creator_id?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface UploadResult {
  url: string;
  path: string;
  success: boolean;
  error?: string;
  type: MediaType;
  metadata?: Record<string, any>;
}
