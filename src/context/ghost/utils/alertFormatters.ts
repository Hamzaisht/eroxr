
import { LiveAlert } from '@/types/surveillance';

export function formatSystemEventAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  details: any
): LiveAlert {
  const baseAlert = {
    id,
    timestamp,
    priority,
    read: false,
    details,
  };

  return {
    ...baseAlert,
    alert_type: 'system_event',
    message: details?.message || 'System event detected',
    userId: details?.userId || '',
    username: details?.username || 'System',
  } as LiveAlert;
}

export function formatSecurityAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  details: any
): LiveAlert {
  const baseAlert = {
    id,
    timestamp,
    priority,
    read: false,
    details,
  };

  return {
    ...baseAlert,
    alert_type: 'security_alert',
    message: details?.message || 'Security alert detected',
    userId: details?.userId || '',
    contentId: details?.contentId || '',
    username: details?.username || 'Security System',
  } as LiveAlert;
}

export function formatUserActionAlert(
  id: string,
  timestamp: string,
  priority: 'low' | 'medium' | 'high',
  userId: string,
  username: string,
  details: any
): LiveAlert {
  return {
    id,
    alert_type: 'user_action',
    timestamp,
    priority,
    read: false,
    message: details?.message || `Action by ${username}`,
    details,
    userId,
    username,
    contentId: details?.contentId || '',
  };
}
