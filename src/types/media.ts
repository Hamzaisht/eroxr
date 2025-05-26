
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export interface MediaItem {
  url: string;
  type: MediaType;
  creator_id?: string;
  thumbnail?: string;
}
