
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageBubble } from "../MessageBubble";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const unreadCountRef = useRef(0);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
      setHasUnreadMessages(false);
      unreadCountRef.current = 0;
    }, 10);
  };

  const handleScrollToBottom = () => {
    scrollToBottom('smooth');
  };

  // Handle scroll events
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollToBottom(!isNearBottom);
    
    // If user scrolls up and is not at the bottom, we should show a badge for new messages
    if (!isNearBottom && unreadCountRef.current > 0) {
      setHasUnreadMessages(true);
    } else if (isNearBottom) {
      setHasUnreadMessages(false);
      unreadCountRef.current = 0;
    }
  };

  useEffect(() => {
    const isFirstLoad = previousMessagesLength.current === 0;
    const hasNewMessages = messages.length > previousMessagesLength.current;
    const latestMessage = messages[messages.length - 1];
    const isOwnLatestMessage = latestMessage && latestMessage.sender_id === currentUserId;
    
    if (isFirstLoad) {
      scrollToBottom('auto');
    } else if (isOwnLatestMessage || isTyping) {
      scrollToBottom('smooth');
    } else if (hasNewMessages) {
      // Check if scroll is already at the bottom
      if (scrollContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        if (isNearBottom) {
          scrollToBottom('smooth');
        } else {
          // Increment unread counter
          unreadCountRef.current += 1;
          setHasUnreadMessages(true);
        }
      }
    }
    
    previousMessagesLength.current = messages.length;
  }, [messages, isTyping, currentUserId]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <ScrollArea 
        className="h-full p-4 overflow-y-auto" 
        scrollHideDelay={300}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="space-y-0">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
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
                  previousMessage={index > 0 ? messages[index - 1] : undefined}
                  showAvatar={message.sender_id !== currentUserId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-start space-x-2 ml-2 mt-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={recipientProfile?.avatar_url} />
                <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              
              <div className="bg-white/5 rounded-2xl px-4 py-2.5">
                <div className="flex space-x-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce animation-delay-200">•</span>
                  <span className="animate-bounce animation-delay-400">•</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
      
      {/* Floating button to scroll to bottom */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4 z-10"
          >
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "rounded-full p-2 shadow-md bg-luxury-darker border border-luxury-neutral/20",
                hasUnreadMessages && "bg-luxury-primary/20"
              )}
              onClick={handleScrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
              {hasUnreadMessages && unreadCountRef.current > 0 && (
                <span className="ml-2 text-xs">{unreadCountRef.current}</span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Import needed component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
