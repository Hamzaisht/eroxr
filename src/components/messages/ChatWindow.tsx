
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MediaUploadDialog } from './MediaUploadDialog';
import { VoiceRecorderDialog } from './VoiceRecorderDialog';
import { BookingDialog } from './BookingDialog';
import { ChatHeader } from './chat/ChatHeader';
import { MessagesList } from './chat/MessagesList';
import { ChatInput } from './chat/ChatInput';

export interface ChatWindowProps {
  userId: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export const ChatWindow = ({ userId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  
  // Dialog states
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  const session = useSession();
  const { toast } = useToast();

  const [userScrolled, setUserScrolled] = useState(false);

  useEffect(() => {
    if (!userId || !session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          return;
        }
        setUserProfile(data || { id: userId, username: 'Unknown User' });
      } catch (error) {
        console.error('Network error fetching user profile:', error);
        setUserProfile({ id: userId, username: 'Unknown User' });
      }
    };

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('id, content, created_at, sender_id, recipient_id')
          .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching messages:', error);
          return;
        }
        setMessages(data || []);
      } catch (error) {
        console.error('Network error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchMessages();
  }, [userId, session?.user?.id]);

  // Real-time message subscription
  useEffect(() => {
    if (!session?.user?.id || !userId) return;

    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${session.user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session.user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user?.id || sending) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          content: newMessage,
          sender_id: session.user.id,
          recipient_id: userId,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // New handlers for WhatsApp-like features
  const handleSendMedia = async (mediaUrl: string, mediaType: string, originalName?: string) => {
    if (!session?.user?.id) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: originalName || `${mediaType} file`,
          sender_id: session.user.id,
          recipient_id: userId,
          message_type: mediaType,
          original_content: mediaUrl
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending media:', error);
      toast({
        title: "Failed to send media",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendVoice = async (audioUrl: string) => {
    if (!session?.user?.id) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          content: 'Voice message',
          sender_id: session.user.id,
          recipient_id: userId,
          message_type: 'audio',
          original_content: audioUrl
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending voice:', error);
      toast({
        title: "Failed to send voice message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ content: newContent })
        .eq('id', messageId)
        .eq('sender_id', session?.user?.id);

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      ));
      setEditingMessageId(null);
      setEditingContent('');
      
      toast({
        title: "Message updated",
        description: "Your message has been edited",
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Failed to edit message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', session?.user?.id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      toast({
        title: "Message deleted",
        description: "Your message has been removed",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Failed to delete message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        handleEditMessage(editingMessageId, editingContent);
      } else {
        sendMessage();
      }
    }
    if (e.key === 'Escape') {
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/60">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full holographic-card relative overflow-hidden group">
      {/* Quantum background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <ChatHeader 
        userProfile={userProfile}
        onBookingClick={() => setShowBookingDialog(true)}
      />

      <MessagesList
        messages={messages}
        currentUserId={session?.user?.id}
        editingMessageId={editingMessageId}
        editingContent={editingContent}
        userScrolled={userScrolled}
        onUserScrolledChange={setUserScrolled}
        onStartEditing={startEditingMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onEditingContentChange={setEditingContent}
        onKeyPress={handleKeyPress}
      />

      <ChatInput
        newMessage={newMessage}
        sending={sending}
        onMessageChange={setNewMessage}
        onSendMessage={sendMessage}
        onMediaClick={() => setShowMediaDialog(true)}
        onVoiceClick={() => setShowVoiceDialog(true)}
        onKeyPress={handleKeyPress}
      />

      {/* Dialogs */}
      <MediaUploadDialog 
        open={showMediaDialog}
        onOpenChange={setShowMediaDialog}
        onSendMedia={handleSendMedia}
      />
      
      <VoiceRecorderDialog 
        open={showVoiceDialog}
        onOpenChange={setShowVoiceDialog}
        onSendVoice={handleSendVoice}
      />
      
      <BookingDialog 
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        recipientId={userId}
        recipientName={userProfile?.username || 'User'}
      />
    </div>
  );
};
