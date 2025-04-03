export type LiveSession = {
  id: string;
  creator_id?: string;
  user_id?: string;
  username?: string;
  creator_username?: string;
  type: string;
  content?: string;
  created_at: string;
  status?: string;
  media_url?: string[] | string;
  avatar_url?: string;
  is_suspended?: boolean;
  is_paused?: boolean;
  pause_end_at?: string;
  pause_reason?: string;
};

export type SurveillanceContentItem = {
  id: string;
  creator_id?: string;
  user_id?: string;
  username?: string;
  type: string;
  content?: string;
  content_type?: string;
  created_at: string;
  status?: string;
  media_url?: string[] | string;
  avatar_url?: string;
  is_suspended?: boolean;
  is_paused?: boolean;
  pause_end_at?: string;
  pause_reason?: string;
};

export type ModerationAction = 
  | 'view' 
  | 'edit' 
  | 'flag' 
  | 'warn' 
  | 'pause'
  | 'unpause' 
  | 'shadowban' 
  | 'delete' 
  | 'ban' 
  | 'restore' 
  | 'force_delete';

export interface SessionModerationActionProps {
  session: LiveSession | SurveillanceContentItem;
  onModerate: (session: LiveSession | SurveillanceContentItem, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}
