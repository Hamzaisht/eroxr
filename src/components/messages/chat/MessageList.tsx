import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageBubble } from "../MessageBubble";
import { useEffect, useRef } from "react";

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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-luxury-dark/50 to-luxury-dark">
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
  );
};