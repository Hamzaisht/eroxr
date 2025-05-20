
export interface LiveSession {
  id: string;
  admin_id: string;
  last_active_at: string;
  ghost_mode: boolean;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

export interface LiveAlert {
  id: string;
  alert_type: 'user_action' | 'system_event' | 'security_alert';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  message: string;
  details?: Record<string, any>;
  user_id?: string;
}

export interface AlertFilter {
  priority?: 'low' | 'medium' | 'high';
  read?: boolean;
  alert_type?: 'user_action' | 'system_event' | 'security_alert';
  fromDate?: Date;
  toDate?: Date;
}
