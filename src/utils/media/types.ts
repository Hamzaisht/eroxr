
// Types for media handling
export enum MediaType {
  UNKNOWN = 'unknown',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  GIF = 'gif',
  DOCUMENT = 'document',
  FILE = 'file' // Add FILE type
}

export interface MediaSource {
  // Required field to store the URL
  url?: string;
  
  // Legacy fields for backward compatibility
  video_url?: string;
  media_url?: string;
  src?: string;
  
  // Additional metadata fields
  media_type?: MediaType;
  thumbnail_url?: string;
  creator_id?: string;
  content_type?: string;
  
  // Arrays for multiple URLs
  video_urls?: string[];
  media_urls?: string[];
}

export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export type MediaTypes = 'image' | 'video' | 'audio' | 'document' | 'all';
