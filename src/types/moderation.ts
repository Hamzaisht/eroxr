
export type ModerationAction = 
  | 'approve' 
  | 'reject' 
  | 'flag' 
  | 'ban' 
  | 'warning'
  | 'delete'
  | 'edit'
  | 'hide'
  | 'restrict'
  | 'view'
  | 'warn'
  | 'shadowban'
  | 'force_delete'
  | 'restore'
  | 'pause'
  | 'unpause';

export interface ModerationDecision {
  id: string;
  content_id: string;
  content_type: string;
  moderator_id: string;
  action: ModerationAction;
  reason: string;
  notes?: string;
  created_at: string;
}
