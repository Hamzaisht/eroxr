
export type ModerationAction =
  | 'view'
  | 'edit'
  | 'flag'
  | 'warn'
  | 'delete'
  | 'ban'
  | 'shadowban'
  | 'force_delete'
  | 'restore';

export interface ModerationResult {
  success: boolean;
  message: string;
  details?: any;
}
