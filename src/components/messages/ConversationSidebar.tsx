import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Archive, Settings, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewMessageDialog } from './NewMessageDialog';

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationSidebarProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ConversationSidebar = ({ selectedConversationId, onSelectConversation }: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchConversations = async () => {
      try {
        // Get all conversations for this user
        const { data: messages, error } = await supabase
          .from('direct_messages')
          .select(`
            *,
            sender:profiles!direct_messages_sender_id_fkey(id, username, avatar_url),
            recipient:profiles!direct_messages_recipient_id_fkey(id, username, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group messages by conversation partner
        const conversationMap = new Map();
        
        messages?.forEach(message => {
          const isOwn = message.sender_id === user.id;
          const partner = isOwn ? message.recipient : message.sender;
          
          if (!conversationMap.has(partner.id)) {
            conversationMap.set(partner.id, {
              id: partner.id,
              user: partner,
              lastMessage: message,
              unreadCount: isOwn ? 0 : 1, // Simple unread logic
              isOnline: Math.random() > 0.5 // Mock online status for now
            });
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        () => {
          fetchConversations(); // Refresh conversations when new message arrives
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Chats</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowNewMessage(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                selectedConversationId === conversation.id ? 'bg-primary/20 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarImage src={conversation.user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white">
                      {conversation.user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate">{conversation.user.username}</h3>
                    <span className="text-xs text-white/60">
                      {conversation.lastMessage && formatTime(conversation.lastMessage.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70 truncate max-w-48">
                      {conversation.lastMessage?.sender_id === user?.id && (
                        <span className="text-primary">You: </span>
                      )}
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="min-w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredConversations.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-white/50" />
            </div>
            <p className="text-white/60">No conversations found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archived
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <NewMessageDialog 
        open={showNewMessage}
        onOpenChange={setShowNewMessage}
        onSelectUser={(userId) => {
          onSelectConversation(userId);
          setShowNewMessage(false);
        }}
      />
    </div>
  );
};