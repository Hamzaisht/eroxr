
export type ModerationAction =
  | 'view'
  | 'edit'
  | 'flag'
  | 'warn'
  | 'delete'
  | 'ban'
  | 'shadowban'
  | 'force_delete'
  | 'restore'
  | 'pause'
  | 'unpause';

export interface ModerationResult {
  success: boolean;
  message: string;
  details?: any;
}
