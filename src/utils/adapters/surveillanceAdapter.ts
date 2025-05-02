
import { LiveSession } from '@/types/surveillance';

/**
 * Converts string IDs to LiveSession objects
 * @param targetUserId - User ID string to convert
 * @returns LiveSession object with minimal data
 */
export function convertUserIdToSession(targetUserId: string): LiveSession {
  return {
    id: crypto.randomUUID(),
    type: 'user',
    user_id: targetUserId,
    started_at: new Date().toISOString(),
    status: 'active',
    is_active: true
  };
}

/**
 * Extracts user ID from LiveSession
 * @param session - LiveSession object
 * @returns User ID string
 */
export function extractUserIdFromSession(session: LiveSession): string {
  return session.user_id;
}
