import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ConversationsListProps {
  onSelectConversation: (recipientId: string) => void;
}

interface Conversation {
  id: string;
  created_at: string;
  user_id_1: string;
  user_id_2: string;
  recipient: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_messages_count: number;
}

export const ConversationsList = ({ onSelectConversation }: ConversationsListProps) => {
  const [error, setError] = useState<string | null>(null);

  const { 
    data: conversations,
    isLoading,
    refetch: refreshConversations 
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select(
            `
            id,
            created_at,
            user_id_1,
            user_id_2,
            recipient:profiles!conversations_user_id_2_fkey(id, username, avatar_url),
            last_message:messages(content, created_at),
            unread_messages_count
            `
          )
          .eq("user_id_1", supabase.auth.currentUser?.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching conversations:", error);
          setError(error.message);
          return [];
        }

        return (data || []) as Conversation[];
      } catch (error: any) {
        console.error("Unexpected error fetching conversations:", error);
        setError(error.message || "An unexpected error occurred");
        return [];
      }
    }
  });

  const handleSelectConversation = (recipientId: string) => {
    onSelectConversation(recipientId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-luxury-neutral/10">
        <h2 className="text-lg font-semibold text-luxury-neutral">Chats</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-luxury-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                <Button variant="link" onClick={() => refreshConversations()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/messages/${conversation.recipient.id}`}
                className="flex items-center space-x-3 rounded-md p-2 hover:bg-luxury-primary/5 transition-colors"
                onClick={() => handleSelectConversation(conversation.recipient.id)}
              >
                <Avatar>
                  <AvatarImage src={conversation.recipient.avatar_url || ""} alt={conversation.recipient.username || "User"} />
                  <AvatarFallback>{conversation.recipient.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{conversation.recipient.username || "Anonymous"}</p>
                  {conversation.last_message && (
                    <p className="text-sm text-luxury-neutral/70 line-clamp-1">
                      {conversation.last_message.content}
                    </p>
                  )}
                </div>
                {conversation.unread_messages_count > 0 && (
                  <Badge variant="secondary">{conversation.unread_messages_count}</Badge>
                )}
              </Link>
            ))
          ) : (
            <p className="text-sm text-luxury-neutral/50 text-center">No conversations yet.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
