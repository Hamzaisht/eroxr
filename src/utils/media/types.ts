
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

export interface MediaItem {
  url: string;
  type: MediaType;
  alt?: string;
}

export interface MediaRendererProps {
  media: MediaItem;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}
