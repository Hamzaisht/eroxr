
export interface LiveAlert {
  id: string;
  type: 'content' | 'security' | 'system' | 'user' | 'violation' | 'risk' | 'information';
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
  session?: any;
  created_at?: string; // Added for compatibility with data from API
}
