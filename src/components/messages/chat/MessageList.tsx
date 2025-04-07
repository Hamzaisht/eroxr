import { useEffect, useRef } from "react";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageBubble } from "../MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeMessages } from "@/hooks";

interface MessageListProps {
  messages: DirectMessage[];
  currentUserId?: string;
  recipientProfile: any;
  isTyping?: boolean;
}

export const MessageList = ({ 
  messages, 
  currentUserId, 
  recipientProfile,
  isTyping = false
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);
  
  useRealtimeMessages(recipientProfile?.id);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    // Use a small timeout to ensure the DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 10);
  };

  // Scroll to bottom on mount and when messages change
  useEffect(() => {
    // If this is the first load or we're the sender of the latest message, scroll smoothly
    const isFirstLoad = previousMessagesLength.current === 0;
    const latestMessage = messages[messages.length - 1];
    const isOwnLatestMessage = latestMessage && latestMessage.sender_id === currentUserId;
    
    if (isFirstLoad) {
      scrollToBottom('auto'); // Instant scroll on first load
    } else if (messages.length > previousMessagesLength.current || isOwnLatestMessage || isTyping) {
      scrollToBottom('smooth'); // Smooth scroll for new messages
    }
    
    previousMessagesLength.current = messages.length;
  }, [messages, isTyping, currentUserId]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
        {isTyping && (
          <div className="flex items-center space-x-2 text-luxury-neutral/70 text-xs">
            <div className="flex space-x-1">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse animation-delay-200">•</span>
              <span className="animate-pulse animation-delay-400">•</span>
            </div>
            <span>{recipientProfile?.username} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
