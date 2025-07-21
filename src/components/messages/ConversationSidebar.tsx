import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Archive, Settings, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewMessageDialog } from './NewMessageDialog';
import { ArchivedChatsDialog } from './dialogs/ArchivedChatsDialog';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { cn } from '@/lib/utils';
import { clsx } from 'clsx';

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
  const [showArchivedChats, setShowArchivedChats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
      {/* Enhanced Header with better mobile touch targets */}
      <div className="p-3 md:p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">Chats</h1>
          <div className="flex gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-white bg-primary/20 hover:bg-primary/30 hover:text-white border border-primary/30 hover:border-primary/50 p-0 touch-manipulation"
              onClick={() => setShowNewMessage(true)}
              aria-label="Start new conversation"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 text-white/70 hover:text-white hover:bg-white/10 p-0 touch-manipulation"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>
        </div>

        {/* Enhanced Search with mobile-optimized input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 
                       focus:border-primary/50 focus:ring-1 focus:ring-primary/30
                       h-9 md:h-10 text-sm md:text-base
                       touch-manipulation"
          />
        </div>
      </div>

      {/* Enhanced Conversations List with better mobile UX */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <AnimatePresence>
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "p-3 md:p-4 border-b border-white/5 cursor-pointer transition-all duration-200",
                "hover:bg-white/5 active:bg-white/10", // Enhanced mobile feedback
                "touch-manipulation", // Better touch handling
                selectedConversationId === conversation.id 
                  ? 'bg-primary/20 border-l-4 border-l-primary shadow-lg' 
                  : ''
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-white/20">
                    <AvatarImage src={conversation.user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white text-sm md:text-base">
                      {conversation.user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate text-sm md:text-base">
                      {conversation.user.username}
                    </h3>
                    <span className="text-xs text-white/60 shrink-0 ml-2">
                      {conversation.lastMessage && formatTime(conversation.lastMessage.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs md:text-sm text-white/70 truncate flex-1">
                      {conversation.lastMessage?.sender_id === user?.id && (
                        <span className="text-primary">You: </span>
                      )}
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="min-w-4 h-4 md:min-w-5 md:h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
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
          <div className="p-6 md:p-8 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Search className="h-6 w-6 md:h-8 md:w-8 text-white/50" />
            </div>
            <p className="text-white/60 text-sm md:text-base">No conversations found</p>
          </div>
        )}
      </div>

      {/* Enhanced Footer with better mobile touch targets */}
      <div className="p-3 md:p-4 border-t border-white/10">
        <div className="flex gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white/70 hover:text-white hover:bg-white/10 h-8 md:h-10 text-xs md:text-sm"
            onClick={() => setShowArchivedChats(true)}
          >
            <Archive className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Archived</span>
            <span className="sm:hidden">Archive</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white/70 hover:text-white hover:bg-white/10 h-8 md:h-10 text-xs md:text-sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
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

      <ArchivedChatsDialog 
        isOpen={showArchivedChats}
        onClose={() => setShowArchivedChats(false)}
      />

      <SettingsDialog 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};