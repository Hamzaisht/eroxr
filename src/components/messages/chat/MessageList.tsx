import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageBubble } from "../MessageBubble";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: DirectMessage[];
  currentUserId?: string;
  recipientProfile: any;
}

export const MessageList = ({ messages, currentUserId, recipientProfile }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === currentUserId}
            currentUserId={currentUserId}
            profile={recipientProfile}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};