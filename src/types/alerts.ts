
export interface LiveAlert {
  id: string;
  type: 'content' | 'security' | 'system' | 'user';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  contentId?: string;
  source?: string;
  requiresAction?: boolean;
  metadata?: Record<string, any>;
}
