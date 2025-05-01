
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageSquarePlus, CheckCheck, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { useToast } from '@/hooks/use-toast';
import { ErrorComponent } from '@/components/ErrorComponent';

interface ProfileWithInfo {
  id: string;
  username: string;
  avatar_url?: string;
  online_status?: string;
  last_message?: {
    content: string | null;
    created_at: string;
    media_url: string[] | null;
    message_type: string;
    delivery_status?: string;
    // Add sender_id to fix the type error
    sender_id?: string;
  };
  unread_count?: number;
  is_typing?: boolean;
}

interface ConversationsListProps {
  onSelectUser: (userId: string) => void;
  onNewMessage: () => void;
  onToggleDetails?: (userId: string) => void;
}

const ConversationsList = ({ onSelectUser, onNewMessage, onToggleDetails }: ConversationsListProps) => {
  const [conversations, setConversations] = useState<ProfileWithInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();
  
  // Format the timestamp to a readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Truncate message content for preview
  const truncateMessage = (message: string | null | undefined, maxLength = 25) => {
    if (!message) return '';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };
  
  const getMessagePreview = (message: ProfileWithInfo['last_message']) => {
    if (!message) return '';
    
    if (message.content) {
      return truncateMessage(message.content);
    }
    
    if (message.media_url && message.media_url.length > 0) {
      switch (message.message_type) {
        case 'image':
          return '📷 Image';
        case 'video':
          return '🎥 Video';
        case 'audio':
          return '🎵 Voice message';
        case 'snap':
          return '👻 Snap';
        default:
          return '📎 Media';
      }
    }
    
    return '';
  };
  
  // Get user conversations
  useEffect(() => {
    const getConversations = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        const userId = session.user.id;
        
        // Get all unique user IDs the current user has chatted with
        const { data: messageData, error: messageError } = await supabase
          .from('direct_messages')
          .select('sender_id, recipient_id, created_at')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false });
          
        if (messageError) throw messageError;
        
        // Get unique user IDs (excluding current user)
        const uniqueUserIds = new Set<string>();
        messageData?.forEach(msg => {
          if (msg.sender_id === userId) {
            uniqueUserIds.add(msg.recipient_id);
          } else {
            uniqueUserIds.add(msg.sender_id);
          }
        });
        
        // Get profile information for each user
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, online_status')
          .in('id', Array.from(uniqueUserIds));
          
        if (profilesError) throw profilesError;
        
        // Get last message for each conversation
        const conversationsWithMessages: ProfileWithInfo[] = [];
        
        for (const profile of profilesData || []) {
          // Get last message between users
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('direct_messages')
            .select('content, created_at, media_url, message_type, delivery_status, sender_id')
            .or(`and(sender_id.eq.${userId},recipient_id.eq.${profile.id}),and(sender_id.eq.${profile.id},recipient_id.eq.${userId})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (lastMessageError && lastMessageError.code !== 'PGRST116') {
            console.error('Error fetching last message:', lastMessageError);
          }
          
          // Get unread count
          const { count, error: countError } = await supabase
            .from('direct_messages')
            .select('id', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('recipient_id', userId)
            .is('viewed_at', null);
            
          if (countError) {
            console.error('Error counting unread messages:', countError);
          }
          
          conversationsWithMessages.push({
            ...profile,
            last_message: lastMessageData || undefined,
            unread_count: count || 0
          });
        }
        
        // Sort by most recent message
        conversationsWithMessages.sort((a, b) => {
          const dateA = a.last_message?.created_at ? new Date(a.last_message.created_at) : new Date(0);
          const dateB = b.last_message?.created_at ? new Date(b.last_message.created_at) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        
        setConversations(conversationsWithMessages);
      } catch (error: any) {
        console.error('Error fetching conversations:', error);
        setError(error.message || 'Failed to load conversations');
        toast({
          title: "Error loading conversations",
          description: error.message || "Please try refreshing",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getConversations();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
        filter: `recipient_id=eq.${session?.user?.id}`
      }, () => {
        getConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, toast]);
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectUser = (userId: string) => {
    setSelectedId(userId);
    onSelectUser(userId);
  };

  const handleToggleDetails = (userId: string) => {
    if (onToggleDetails) {
      onToggleDetails(userId);
    }
  };
  
  // Retry loading conversations
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Force re-run of the effect
    setConversations([]);
  };
  
  return (
    <div className="flex flex-col h-full bg-luxury-darker border-r border-luxury-neutral/20">
      {/* Header */}
      <div className="p-3 border-b border-luxury-neutral/20 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={onNewMessage}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9 bg-luxury-neutral/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Conversations List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin h-5 w-5 border-2 border-luxury-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          </div>
        ) : error ? (
          <ErrorComponent 
            message="Failed to load conversations" 
            className="m-4" 
            onRetry={handleRetry}
          />
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "px-3 py-3 hover:bg-luxury-neutral/5 transition-colors border-b border-luxury-neutral/10",
                selectedId === contact.id && "bg-luxury-dark",
                contact.unread_count && contact.unread_count > 0 ? "bg-luxury-neutral/10" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  className="flex flex-grow items-center gap-3 text-left"
                  onClick={() => handleSelectUser(contact.id)}
                >
                  <div className="relative">
                    <Avatar className={cn(
                      "h-10 w-10 border",
                      contact.unread_count && contact.unread_count > 0 
                        ? "border-luxury-primary" 
                        : "border-transparent"
                    )}>
                      <AvatarImage src={contact.avatar_url || ""} alt={contact.username} />
                      <AvatarFallback>
                        {contact.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    {contact.online_status === 'online' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-luxury-darker" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{contact.username}</span>
                      {contact.last_message && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(contact.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-1">
                      <div className="text-sm text-muted-foreground truncate flex items-center gap-1 max-w-[80%]">
                        {contact.is_typing ? (
                          <span className="text-luxury-primary text-xs">Typing...</span>
                        ) : (
                          <>
                            {contact.last_message && contact.last_message.sender_id === session?.user?.id && (
                              <CheckCheck className={cn(
                                "h-3.5 w-3.5", 
                                contact.last_message.delivery_status === 'seen' 
                                  ? "text-luxury-primary" 
                                  : "text-muted-foreground"
                              )} />
                            )}
                            <span className="truncate">
                              {getMessagePreview(contact.last_message)}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {contact.unread_count && contact.unread_count > 0 && (
                        <div className="bg-luxury-primary rounded-full h-5 min-w-5 flex items-center justify-center px-1.5 text-xs font-medium">
                          {contact.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Chat details button - Added here */}
                {onToggleDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full flex-shrink-0"
                    onClick={() => handleToggleDetails(contact.id)}
                  >
                    <Info className="h-4 w-4 text-luxury-neutral/70" />
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {searchTerm ? "No contacts match your search" : "No conversations yet"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationsList;
