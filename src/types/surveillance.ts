
export type ContentType = 'story' | 'post' | 'video' | 'audio';

export type LiveSessionType = 'stream' | 'call' | 'chat';

export type LiveSession = {
  id: string;
  type: LiveSessionType;
  creator_id: string;
  viewer_count?: number;
  created_at: string;
  sender_username?: string;
  location?: string;
  video_url?: string;
};

export type BaseSurveillanceContentItem = {
  id: string;
  user_id: string;
  title: string;
  status: string;
  content_type: ContentType;
  created_at: string;
  is_ppv?: boolean;
  ppv_amount?: number;
};

export type SurveillanceContentItem = BaseSurveillanceContentItem;

export type ModerationAction =
  | 'delete'
  | 'flag'
  | 'warn'
  | 'shadowban'
  | 'view'
  | 'restore'
  | 'force_delete'
  | 'pause'
  | 'unpause';
