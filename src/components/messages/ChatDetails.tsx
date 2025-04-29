import { useState, useEffect, useRef } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Ban, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ChatDetailsProps {
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  onBack: () => void;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  sender_username: string;
  sender_avatar_url: string | null;
}

export const ChatDetails = ({ 
  recipient,
  onBack 
}: ChatDetailsProps) => {
  const [messageText, setMessageText] = useState("");
  const { id: currentUserId } = useSession()?.user || {};
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const recipientId = recipient?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", recipientId],
    queryFn: async () => {
      if (!recipientId || !currentUserId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          recipient_id,
          sender_username:sender_id(username),
          sender_avatar_url:sender_id(avatar_url)
        `)
        .or(`and(sender_id.eq.${currentUserId}, recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId}, recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data?.map(msg => ({
        ...msg,
        sender_username: msg.sender_username?.username,
        sender_avatar_url: msg.sender_avatar_url?.avatar_url
      })) as Message[];
    },
    enabled: !!recipientId && !!currentUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!messageText.trim() || !recipientId || !currentUserId) return;

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: messageText,
            sender_id: currentUserId,
            recipient_id: recipientId,
            sender_username: useSession()?.user?.user_metadata?.username as string,
            sender_avatar_url: useSession()?.user?.user_metadata?.avatar_url as string
          }
        ]);

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      setMessageText("");
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", recipientId] });
    },
    onError: (error) => {
      console.error("Error in sendMessageMutation:", error);
    }
  });

  const blockMutation = useMutation({
    mutationFn: async () => {
      if (!recipientId || !currentUserId) return;

      const { error } = await supabase
        .from('blocked_users')
        .insert([
          {
            blocker_id: currentUserId,
            blocked_id: recipientId
          }
        ]);

      if (error) {
        console.error("Error blocking user:", error);
        throw error;
      }

      setIsBlocked(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", recipientId] });
    },
    onError: (error) => {
      console.error("Error in blockMutation:", error);
    }
  });

  const isBlocking = blockMutation.isLoading; // Use isLoading instead of isPending
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    sendMessageMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          ←
        </Button>
        <Avatar>
          <AvatarImage src={recipient?.avatar_url || ""} alt={recipient?.username || "User"} />
          <AvatarFallback>{recipient?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{recipient?.username || "User"}</h2>
        </div>
      </div>

      <div className="h-[calc(100vh-300px)] rounded-md border bg-muted p-4">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messagesLoading ? (
              <div>Loading messages...</div>
            ) : (
              messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.sender_id === currentUserId ? 'items-end' : 'items-start'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    {message.sender_id !== currentUserId && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={message.sender_avatar_url || ""} alt={message.sender_username || "User"} />
                        <AvatarFallback>{message.sender_username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{message.sender_username}</p>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={sendMessage} disabled={sendMessageMutation.isLoading}>
          {sendMessageMutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      
      <Button
        onClick={() => blockMutation.mutate()}
        variant="destructive"
        disabled={isBlocking} // Use isLoading instead
        className="w-full"
      >
        {isBlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
        Block User
      </Button>
    </div>
  );
}
