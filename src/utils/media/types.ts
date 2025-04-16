
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

export interface MediaSource {
  id?: string;
  media_url?: string | null;
  media_urls?: string[] | null;
  video_url?: string | null;
  video_urls?: string[] | null;
  url?: string | null;
  src?: string | null;
  type?: string;
  media_type?: string;
  content_type?: string;
}

export interface MediaResult {
  url: string | null;
  type: MediaType;
  contentType: string;
  isError: boolean;
  errorMessage?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}
