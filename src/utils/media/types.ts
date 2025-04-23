export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  TEXT = 'text'
}

export interface MediaItem {
  media_url: string;
  media_type: MediaType;
}

export interface ActiveSurveillanceState {
  active: boolean;
  userId: string;
  targetUserId: string;
  startedAt: Date | undefined;
  duration: number;
  sessionId: string;
  isWatching: boolean;
  session: any | null;
  startTime: string | null;
}
