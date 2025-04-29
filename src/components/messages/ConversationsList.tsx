import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define the proper Conversation type interface if needed
interface Conversation {
  id: string;
  created_at: string;
  user_id_1: string;
  user_id_2: string;
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  };
  unread_messages_count: number;
}

export interface ConversationsListProps {
  onSelectUser: (userId: string) => void;
  onNewMessage: () => void;
}

const ConversationsList = ({ onSelectUser, onNewMessage }: ConversationsListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fix the auth.currentUser issue
  const session = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      console.warn("User not logged in.");
      return;
    }

    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("direct_messages_conversations")
          .select(
            `
            id,
            created_at,
            user_id_1,
            user_id_2,
            recipient: direct_messages_recipients(id, username, avatar_url),
            last_message: direct_messages(content, created_at),
            unread_messages_count
          `
          )
          .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching conversations:", error);
          setError(error.message);
        } else {
          // Fix the type conversion for conversations
          const typedConversations: Conversation[] = (data || []).map((conv: any) => ({
            id: conv.id,
            created_at: conv.created_at,
            user_id_1: conv.user_id_1,
            user_id_2: conv.user_id_2,
            recipient: conv.recipient && conv.recipient[0] ? {
              id: conv.recipient[0].id,
              username: conv.recipient[0].username || "Unknown",
              avatar_url: conv.recipient[0].avatar_url
            } : {
              id: "",
              username: "Unknown",
              avatar_url: null
            },
            last_message: conv.last_message && conv.last_message[0] ? {
              content: conv.last_message[0].content,
              created_at: conv.last_message[0].created_at
            } : {
              content: "No messages",
              created_at: conv.created_at
            },
            unread_messages_count: conv.unread_messages_count || 0
          }));
          setConversations(typedConversations);
        }
      } catch (err: any) {
        console.error("Failed to fetch conversations:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  const getRecipient = (conversation: Conversation) => {
    if (conversation.recipient) {
      return conversation.recipient;
    }
    return {
      id: "unknown",
      username: "Unknown",
      avatar_url: null,
    };
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
            <p className="text-red-500 p-4">Error: {error}</p>
          ) : conversations.length === 0 ? (
            <p className="text-luxury-neutral p-4">No conversations yet.</p>
          ) : (
            conversations.map((conversation) => {
              const recipient = getRecipient(conversation);
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectUser(recipient.id)}
                  className="w-full flex items-center space-x-2 py-3 px-4 hover:bg-luxury-dark transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={recipient.avatar_url || ""} alt={recipient.username} />
                    <AvatarFallback>{recipient.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">{recipient.username}</p>
                    <p className="text-xs text-luxury-neutral line-clamp-1">
                      {conversation.last_message?.content || "No messages"}
                    </p>
                  </div>
                  {conversation.unread_messages_count > 0 && (
                    <Badge variant="secondary">
                      {conversation.unread_messages_count}
                    </Badge>
                  )}
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
