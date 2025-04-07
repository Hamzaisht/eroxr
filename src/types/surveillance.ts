
export type ContentType = 'story' | 'post' | 'video' | 'audio';

export type LiveSessionType = 'stream' | 'call' | 'chat' | 'bodycontact' | 'content';

export type LiveSession = {
  id: string;
  type?: LiveSessionType;
  user_id?: string;
  creator_id?: string;
  username?: string;
  avatar_url?: string;
  viewer_count?: number;
  created_at: string;
  started_at?: string;
  title?: string;
  description?: string;
  status?: string;
  sender_username?: string;
  location?: string;
  video_url?: string;
  content?: string;
  media_url?: string[] | string;
  content_type?: string;
  message_type?: string;
  recipient_id?: string;
  recipient_username?: string;
  is_paused?: boolean;
  visibility?: string;
  thumbnail_url?: string;
};

export type BaseSurveillanceContentItem = {
  id: string;
  user_id?: string;
  creator_id?: string;
  title?: string;
  status?: string;
  content_type?: ContentType | string;
  created_at: string;
  is_ppv?: boolean;
  ppv_amount?: number;
  content?: string;
  description?: string;
  media_url?: string[] | string;
  username?: string;
  creator_username?: string;
  avatar_url?: string;
  creator_avatar_url?: string;
  visibility?: string;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  location?: string;
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
  | 'unpause'
  | 'ban' 
  | 'edit';
