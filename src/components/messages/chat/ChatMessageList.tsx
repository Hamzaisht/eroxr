
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageBubble } from "../MessageBubble";

interface ChatMessageListProps {
  messages: DirectMessage[];
  currentUserId?: string;
  recipientProfile: any;
  isTyping?: boolean;
}

export const ChatMessageList = ({
  messages,
  currentUserId,
  recipientProfile,
  isTyping = false
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 10);
  };

  useEffect(() => {
    const isFirstLoad = previousMessagesLength.current === 0;
    const latestMessage = messages[messages.length - 1];
    const isOwnLatestMessage = latestMessage && latestMessage.sender_id === currentUserId;
    
    if (isFirstLoad) {
      scrollToBottom('auto');
    } else if (messages.length > previousMessagesLength.current || isOwnLatestMessage || isTyping) {
      scrollToBottom('smooth');
    }
    
    previousMessagesLength.current = messages.length;
  }, [messages, isTyping, currentUserId]);

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble
                message={message}
                isOwnMessage={message.sender_id === currentUserId}
                currentUserId={currentUserId}
                profile={message.sender_id !== currentUserId ? recipientProfile : undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center space-x-2 text-luxury-neutral/70 text-xs"
          >
            <div className="flex space-x-1">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse animation-delay-200">•</span>
              <span className="animate-pulse animation-delay-400">•</span>
            </div>
            <span>{recipientProfile?.username} is typing...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
