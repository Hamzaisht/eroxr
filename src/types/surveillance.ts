
export interface LiveSession {
  id: string;
  user_id: string;
  username: string;
  type: string;
  created_at?: string;
  last_active?: string;
  ip_address?: string;
  device_info?: any;
  status?: string;
  avatar_url?: string;
}

export interface LiveAlert {
  id: string;
  type: string;
  alert_type?: 'violation' | 'risk' | 'information';
  user_id: string;
  username: string;
  timestamp: string | number;
  created_at?: string;
  content_type?: string;
  reason?: string;
  severity: 'high' | 'medium' | 'low';
  content_id?: string;
  message: string;
  status?: string;
  title?: string;
  description?: string;
  is_viewed?: boolean;
  urgent?: boolean;
  session?: LiveSession | null;
}
