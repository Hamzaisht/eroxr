
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
  | 'unpause';

export interface ModerationActionResult {
  success: boolean;
  message?: string;
}
