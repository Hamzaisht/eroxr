
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
    username: 'Unknown', // Adding required username property
    started_at: new Date().toISOString(),
    status: 'active',
    is_active: true,
    created_at: new Date().toISOString()
  };
}

/**
 * Converts LiveSession to user ID string
 * @param session - LiveSession object
 * @returns User ID string
 */
export function extractUserIdFromSession(session: LiveSession): string {
  return session.user_id;
}

/**
 * Creates a LiveSession object from direct message data
 * @param messageData - Direct message data
 * @returns LiveSession object
 */
export function convertMessageToSession(messageData: any): LiveSession {
  return {
    id: messageData.id || crypto.randomUUID(),
    type: 'chat',
    user_id: messageData.sender_id,
    username: messageData.sender_username,
    avatar_url: messageData.sender_avatar_url,
    started_at: messageData.created_at,
    status: 'active',
    is_active: true,
    content: messageData.content,
    media_url: messageData.media_url || [],
    created_at: messageData.created_at,
    content_type: 'message',
    recipient_id: messageData.recipient_id,
    recipient_username: messageData.recipient_username,
    recipient_avatar: messageData.recipient_avatar_url,
    message_type: messageData.message_type,
    // Moving sender_username to be an allowed property
    sender_username: messageData.sender_username
  };
}

/**
 * Creates a LiveSession object from streaming data
 * @param streamData - Stream data
 * @returns LiveSession object
 */
export function convertStreamToSession(streamData: any): LiveSession {
  return {
    id: streamData.id || crypto.randomUUID(),
    type: 'stream',
    user_id: streamData.creator_id,
    username: streamData.creator_username,
    avatar_url: streamData.creator_avatar_url,
    started_at: streamData.started_at || streamData.created_at,
    title: streamData.title,
    description: streamData.description,
    status: streamData.status,
    is_active: streamData.status === 'live',
    media_url: streamData.playback_url ? [streamData.playback_url] : [],
    created_at: streamData.created_at,
    content_type: 'stream',
    // Moving viewer_count to be an allowed property
    viewer_count: streamData.viewer_count || 0
  };
}
