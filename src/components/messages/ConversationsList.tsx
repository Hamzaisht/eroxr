import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

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
    content: string | null;
    media_url: string[] | null;
    message_type: string | null;
    created_at: string;
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
              content: message.content,
              media_url: message.media_url,
              message_type: message.message_type,
              created_at: message.created_at
            },
            unread_count: message.recipient_id === userId && !message.viewed_at ? 1 : 0
          };
        }
        
        // Otherwise, if this message is newer than the last one we've seen, update
        else if (new Date(message.created_at) > new Date(conversationMap[otherUserId].last_message.created_at)) {
          conversationMap[otherUserId].last_message = {
            content: message.content,
            media_url: message.media_url,
            message_type: message.message_type,
            created_at: message.created_at
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
    enabled: !!userId
  });

  // Format message preview text based on message type
  const getMessagePreview = (message: Conversation['last_message']) => {
    if (message.content) return message.content;
    
    switch (message.message_type) {
      case 'media': return 'Sent a photo';
      case 'video': return 'Sent a video';
      case 'audio': return 'Sent a voice message';
      case 'document': return 'Sent a document';
      case 'snap': return 'Sent a snap';
      default: return 'New message';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-luxury-primary/20">
        <button
          onClick={onNewMessage}
          className="w-full py-2 text-sm text-white bg-luxury-primary rounded-md hover:bg-luxury-primary/80 transition-colors"
        >
          New Message
        </button>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="py-2">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {(error as Error).message}</p>
          ) : conversations && conversations.length === 0 ? (
            <p className="text-luxury-neutral p-4">No conversations yet.</p>
          ) : (
            conversations?.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectUser(conversation.recipient.id)}
                className="w-full flex items-center space-x-2 py-3 px-4 hover:bg-luxury-dark transition-colors"
              >
                <Avatar>
                  <AvatarImage src={conversation.recipient.avatar_url || ""} alt={conversation.recipient.username} />
                  <AvatarFallback>{conversation.recipient.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{conversation.recipient.username}</p>
                  <p className="text-xs text-luxury-neutral line-clamp-1">
                    {getMessagePreview(conversation.last_message)}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge variant="secondary">
                    {conversation.unread_count}
                  </Badge>
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationsList;
