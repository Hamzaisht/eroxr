
import { useCallback, useState } from "react";
import { LiveSession } from "../types";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ChatSender {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface ChatRecipient {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function useChatsSurveillance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  const fetchChatSessions = useCallback(async (): Promise<LiveSession[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock data - in a real app, this would be an API call
      const response = await new Promise<{status: number, data: LiveSession[]}>(resolve => setTimeout(() => {
        resolve({
          status: 200,
          data: generateMockChatData(),
        });
      }, 500));

      if (response.status === 200) {
        setSessions(response.data);
        return response.data; // Return the data for external use
      } else {
        setError('Failed to fetch chat sessions');
        return [];
      }
    } catch (err) {
      console.error("Error fetching chat sessions:", err);
      setError('An error occurred while fetching chat data');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sessions,
    fetchChatSessions,
  };
}

// Mock data generator
function generateMockChatData(): LiveSession[] {
  const chatData = [];
  
  for (let i = 1; i <= 10; i++) {
    // Create sender and recipient as individual objects, not arrays
    const sender: ChatSender = {
      id: `user-${i}`,
      username: `user${i}`,
      avatar_url: null
    };
    
    const recipient: ChatRecipient = {
      id: `user-${i + 10}`,
      username: `user${i + 10}`,
      avatar_url: null
    };
    
    chatData.push({
      id: `chat-${i}`,
      type: 'chat',
      user_id: sender.id,
      username: sender.username,
      avatar_url: sender.avatar_url,
      started_at: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      title: `Chat between ${sender.username} and ${recipient.username}`,
      content: `Message #${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      media_url: [],
      recipient_id: recipient.id,
      recipient_username: recipient.username,
      sender_username: sender.username,
      sender_profiles: {
        username: sender.username,
        avatar_url: sender.avatar_url
      },
      receiver_profiles: {
        username: recipient.username,
        avatar_url: recipient.avatar_url
      }
    });
  }
  
  return chatData;
}
