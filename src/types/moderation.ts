
export type ModerationAction = 
  | 'delete' 
  | 'flag' 
  | 'ban' 
  | 'warn' 
  | 'shadowban' 
  | 'edit'
  | 'view'
  | 'restore'
  | 'force_delete'
  | 'pause'
  | 'unpause'
  | 'review'
  | 'dismiss';

export interface ModerationActionResult {
  success: boolean;
  message?: string;
}
