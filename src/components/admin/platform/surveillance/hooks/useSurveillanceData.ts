
import { useState, useEffect } from 'react';
import { LiveSession } from '@/types/surveillance';
import { supabase } from '@/integrations/supabase/client';
import { useSurveillance } from '../SurveillanceContext';

export function useSurveillanceData() {
  const { setError } = useSurveillance();
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  
  // Function to fetch live sessions
  const fetchLiveSessions = async () => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      // Mock data for development - in a real app you'd fetch from Supabase
      const mockSessions: LiveSession[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          username: "creator1",
          avatar_url: "https://i.pravatar.cc/150?u=1",
          user_id: "user-123",
          type: "stream",
          status: "active",
          title: "Live Gaming Stream",
          description: "Playing the latest games",
          viewer_count: 125,
          started_at: new Date().toISOString(),
          thumbnail_url: "https://picsum.photos/seed/stream1/300/200",
          created_at: new Date().toISOString(),
          is_active: true,
          content: "Live gaming content",
          media_url: ["https://picsum.photos/seed/stream1/800/600"],
          content_type: "image/jpeg",
          participants: 125,
          location: "Stockholm"
        },
        {
          id: "223e4567-e89b-12d3-a456-426614174001",
          username: "creator2",
          avatar_url: "https://i.pravatar.cc/150?u=2",
          user_id: "user-456",
          type: "chat",
          status: "active",
          title: "Private Chat Session",
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_active: true,
          content: "Private chat content",
          media_url: ["https://picsum.photos/seed/chat1/800/600"],
          content_type: "image/jpeg",
          recipient_username: "user5",
          message_type: "text",
          sender_username: "creator2"
        },
        {
          id: "323e4567-e89b-12d3-a456-426614174002",
          username: "creator3",
          avatar_url: "https://i.pravatar.cc/150?u=3",
          user_id: "user-789",
          type: "call",
          status: "active",
          title: "Video Call Session",
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_active: true,
          content: "Private video call",
          media_url: ["https://picsum.photos/seed/call1/800/600"],
          content_type: "video/mp4",
          sender_username: "creator3",
          recipient_username: "user7"
        },
        {
          id: "423e4567-e89b-12d3-a456-426614174003",
          username: "creator4",
          avatar_url: "https://i.pravatar.cc/150?u=4",
          user_id: "user-101",
          type: "bodycontact",
          status: "active",
          title: "Dating Profile Activity",
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_active: true,
          content: "Dating profile activity",
          media_url: ["https://picsum.photos/seed/dating1/800/600"],
          content_type: "image/jpeg",
          location: "Oslo",
          tags: ["dating", "social"]
        }
      ];
      
      setLiveSessions(mockSessions);
    } catch (err) {
      console.error("Error fetching surveillance data:", err);
      const errorMessage = "Failed to load surveillance data";
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchLiveSessions();
    
    // Set up realtime subscription
    const setupRealtimeSubscription = async () => {
      const channel = supabase
        .channel('surveillance-updates')
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync');
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Presence join:', key, newPresences);
          fetchLiveSessions();
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Presence leave:', key, leftPresences);
          fetchLiveSessions();
        })
        .subscribe();
      
      // Clean up subscription
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    setupRealtimeSubscription();
    
    // Set up refresh interval
    const intervalId = setInterval(fetchLiveSessions, 60000); // Refresh every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return {
    liveSessions,
    isLoading,
    error,
    refreshData: fetchLiveSessions
  };
}
