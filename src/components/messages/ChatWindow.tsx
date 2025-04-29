import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface ChatWindowProps {
  recipient: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  onClose: () => void;
  onSendSuccess?: () => void;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export const ChatWindow = ({ 
  recipient, 
  onClose,
  onSendSuccess 
}: ChatWindowProps) => {
  const [messageText, setMessageText] = useState("");
  const [messagesEnd, setMessagesEnd] = useState<HTMLElement | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const currentUserId = session?.user?.id;
  const recipientId = recipient?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEnd?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const { 
    data: messages,
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["messages", recipientId],
    queryFn: async () => {
      if (!recipientId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},sender_id.eq.${recipientId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data as Message[];
    },
    enabled: !!recipientId
  });

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: uuidv4(),
      content: messageText,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
    };

    setMessageText("");

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            id: newMessage.id,
            content: messageText,
            sender_id: currentUserId,
            recipient_id: recipientId,
          },
        ]);

      if (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error sending message",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      await refetch();
      scrollToBottom();
      onSendSuccess?.();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File attached",
        description: `You have attached ${file.name}. This feature is coming soon!`,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-luxury-neutral/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={recipient?.avatar_url || ""} alt={recipient?.username || "User"} />
            <AvatarFallback>{recipient?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{recipient?.username}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading messages...</div>
          ) : (
            messages?.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender_id === currentUserId ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${message.sender_id === currentUserId
                    ? 'bg-luxury-primary text-white'
                    : 'bg-luxury-darker text-luxury-neutral'
                    }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-luxury-neutral/60 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => { setMessagesEnd(el); }}
          >
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-luxury-neutral/20">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleAttachFile}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-luxury-darker border-luxury-neutral/20"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};
