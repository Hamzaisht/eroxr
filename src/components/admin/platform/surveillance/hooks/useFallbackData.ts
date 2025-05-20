
import { useState, useEffect } from 'react';
import { LiveSession, SessionType, SessionStatus } from '@/types/surveillance';

export function useFallbackData() {
  const [fallbackData, setFallbackData] = useState<LiveSession[]>([]);
  
  useEffect(() => {
    // Generate some fallback data for demo purposes
    const demoSessions: LiveSession[] = [
      {
        id: 'stream-1',
        user_id: 'user-123',
        username: 'LiveStreamUser',
        type: SessionType.STREAM,
        title: 'Live Demo Stream',
        description: 'This is a demo livestream for testing',
        started_at: new Date().toISOString(),
        status: SessionStatus.ACTIVE,
        viewer_count: 156,
        is_active: true,
        content_type: 'video',
        media_url: ['https://example.com/stream-thumbnail.jpg'],
        thumbnail_url: 'https://example.com/stream-thumbnail.jpg'
      },
      {
        id: 'call-1',
        user_id: 'user-456',
        username: 'CallUser',
        type: SessionType.CALL,
        title: 'Private Call Session',
        started_at: new Date().toISOString(),
        status: SessionStatus.ACTIVE,
        participants: 2,
        recipient_username: 'CallRecipient',
        is_active: true
      },
      {
        id: 'chat-1',
        user_id: 'user-789',
        username: 'ChatUser',
        type: SessionType.CHAT,
        started_at: new Date().toISOString(),
        status: SessionStatus.ACTIVE,
        content: 'This is a sample chat message',
        sender_username: 'ChatUser',
        recipient_username: 'ChatRecipient',
        media_url: ['https://example.com/chat-image.jpg'],
        message_type: 'text',
        is_active: true
      },
      {
        id: 'bodycontact-1',
        user_id: 'user-101',
        username: 'BodyContactUser',
        type: SessionType.BODYCONTACT,
        title: 'Body Contact Session',
        started_at: new Date().toISOString(),
        status: SessionStatus.ACTIVE,
        location: 'Stockholm, Sweden',
        tags: ['dating', 'premium', 'verified'],
        is_active: true
      },
      {
        id: 'content-1',
        user_id: 'user-102',
        username: 'ContentCreator',
        type: SessionType.CONTENT,
        title: 'New Content Upload',
        started_at: new Date().toISOString(),
        status: SessionStatus.ACTIVE,
        content_type: 'video',
        media_url: ['https://example.com/content-thumbnail.jpg'],
        is_active: true
      }
    ];
    
    setFallbackData(demoSessions);
  }, []);
  
  return fallbackData;
}
