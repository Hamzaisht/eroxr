import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from 'date-fns';
import { Circle, Search, UserPlus, CheckCheck, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the proper Conversation type interface
interface Conversation {
  id: string;
  created_at: string;
  other_user_id: string;
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  last_message: {
    id: string;
    content: string | null;
    media_url: string[] | null;
    message_type: string | null;
    created_at: string;
    delivery_status?: string;
  };
  unread_count: number;
}

export interface ConversationsListProps {
  onSelectUser: (userId: string) => void;
  onNewMessage: () => void;
}

const ConversationsList = ({ onSelectUser, onNewMessage }: ConversationsListProps) => {
  const session = useSession();
  const userId = session?.user?.id;
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  // Track online users
  useEffect(() => {
    if (!userId) return;
    
    const presenceChannel = supabase.channel('online-users');
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const onlineUserMap: Record<string, boolean> = {};
        
        for (const [key, presences] of Object.entries(state)) {
          const presenceUserId = (presences as any[])[0].user_id;
          onlineUserMap[presenceUserId] = true;
        }
        
        setOnlineUsers(onlineUserMap);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [userId]);
  
  // Use React Query for better data fetching
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not logged in");
      
      // Fetch all direct messages involving this user
      const { data: messageData, error: messageError } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });
        
      if (messageError) throw messageError;
      
      // Group messages by conversation (based on the other user)
      const conversationMap: Record<string, any> = {};
      
      for (const message of messageData || []) {
        // Determine the other user in the conversation
        const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;
        
        // Skip if no other user (shouldn't happen, but just in case)
        if (!otherUserId) continue;
        
        // If this conversation isn't in our map yet, add it
        if (!conversationMap[otherUserId]) {
          conversationMap[otherUserId] = {
            id: otherUserId, // Using the other user's ID as the conversation ID
            created_at: message.created_at,
            other_user_id: otherUserId,
            last_message: {
              id: message.id,
              content: message.content,
              media_url: message.media_url,
              message_type: message.message_type,
              created_at: message.created_at,
              delivery_status: message.delivery_status
            },
            unread_count: message.recipient_id === userId && !message.viewed_at ? 1 : 0
          };
        }
        
        // Otherwise, if this message is newer than the last one we've seen, update
        else if (new Date(message.created_at) > new Date(conversationMap[otherUserId].last_message.created_at)) {
          conversationMap[otherUserId].last_message = {
            id: message.id,
            content: message.content,
            media_url: message.media_url,
            message_type: message.message_type,
            created_at: message.created_at,
            delivery_status: message.delivery_status
          };
          conversationMap[otherUserId].created_at = message.created_at;
        }
        
        // Count unread messages
        if (message.recipient_id === userId && !message.viewed_at) {
          if (conversationMap[otherUserId].created_at !== message.created_at) { // Avoid double counting the last message
            conversationMap[otherUserId].unread_count += 1;
          }
        }
      }
      
      // Fetch profiles for the conversation partners
      const otherUserIds = Object.keys(conversationMap);
      
      if (otherUserIds.length === 0) return [];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', otherUserIds);
        
      if (profilesError) throw profilesError;
      
      // Map profiles to conversations
      const profileMap: Record<string, any> = {};
      for (const profile of profiles || []) {
        profileMap[profile.id] = profile;
      }
      
      // Build the final conversations array with profiles
      return Object.values(conversationMap).map((conv: any) => {
        return {
          ...conv,
          recipient: profileMap[conv.other_user_id] || {
            id: conv.other_user_id,
            username: "Unknown User",
            avatar_url: null
          }
        };
      }).sort((a: any, b: any) => {
        // Sort by most recent message
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      }) as Conversation[];
    },
    enabled: !!userId,
    refetchInterval: 60000 // Refetch every minute
  });

  // Format message preview text based on message type
  const getMessagePreview = (message: Conversation['last_message']) => {
    if (message.content) return message.content;
    
    switch (message.message_type) {
      case 'media': return '📷 Photo';
      case 'video': return '🎥 Video';
      case 'audio': return '🎤 Voice message';
      case 'document': return '📄 Document';
      case 'snap': return '👻 Snap';
      default: return 'New message';
    }
  };
  
  // Format time relative to now
  const getFormattedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If same day, return time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within past week, return day name
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise return short date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Get message status icon
  const getMessageStatusIcon = (conversation: Conversation) => {
    // Only show status for messages sent by current user
    if (conversation.last_message.delivery_status && 
        conversation.other_user_id === conversation.last_message.recipient_id) {
      switch (conversation.last_message.delivery_status) {
        case 'sent':
          return <Check className="h-3 w-3 text-gray-400" />;
        case 'delivered':
          return <CheckCheck className="h-3 w-3 text-gray-400" />;
        case 'seen':
          return <CheckCheck className="h-3 w-3 text-blue-400" />;
        case 'failed':
          return <X className="h-3 w-3 text-red-400" />;
        default:
          return null;
      }
    }
    return null;
  };
  
  // Filter conversations based on search term
  const filteredConversations = conversations?.filter(conversation => 
    conversation.recipient.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-luxury-primary/20">
        <div className="flex flex-col gap-3">
          <Button
            onClick={onNewMessage}
            className="w-full py-2 text-sm text-white bg-luxury-primary rounded-md hover:bg-luxury-primary/80 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New Message
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-neutral/50" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-luxury-neutral/5 border-luxury-neutral/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="py-2">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {(error as Error).message}</p>
          ) : filteredConversations && filteredConversations.length === 0 ? (
            searchTerm ? (
              <p className="text-luxury-neutral p-4">No conversations match your search.</p>
            ) : (
              <p className="text-luxury-neutral p-4">No conversations yet.</p>
            )
          ) : (
            filteredConversations?.map((conversation) => {
              const isOnline = onlineUsers[conversation.other_user_id];
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectUser(conversation.recipient.id)}
                  className="w-full flex items-center space-x-3 py-3 px-4 hover:bg-luxury-dark transition-colors border-b border-luxury-neutral/10 last:border-b-0"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.recipient.avatar_url || ""} alt={conversation.recipient.username} />
                      <AvatarFallback>{conversation.recipient.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-luxury-darker" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-medium text-white truncate">
                        {conversation.recipient.username}
                      </h4>
                      <span className="text-xs text-luxury-neutral flex items-center gap-1">
                        {getMessageStatusIcon(conversation)}
                        {getFormattedTime(conversation.last_message.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-luxury-neutral line-clamp-1 max-w-[70%]">
                        {getMessagePreview(conversation.last_message)}
                      </p>
                      
                      {conversation.unread_count > 0 && (
                        <Badge variant="secondary" className="ml-auto bg-luxury-primary">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationsList;
