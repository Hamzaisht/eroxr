
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const useRealtimeMessages = (conversationId: string | null = null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`sender_id.eq.${conversationId},recipient_id.eq.${conversationId}`)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase.channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `sender_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { messages, isLoading, error };
};
