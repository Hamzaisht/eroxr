
import React, { useRef, useEffect, useCallback } from "react";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageBubble } from "../MessageBubble";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ChatMessageListProps {
  messages: DirectMessage[];
  currentUserId: string;
  recipientProfile: {
    username: string;
    avatar_url?: string;
    online_status?: string;
  };
  isTyping?: boolean;
  onRetry?: (message: DirectMessage) => Promise<any>;
}

export const ChatMessageList = ({ 
  messages, 
  currentUserId, 
  recipientProfile,
  isTyping,
  onRetry
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottomRef = useRef<boolean>(true);
  
  // Auto-scroll to bottom on new messages if already at bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    console.log('Scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior });
    isScrolledToBottomRef.current = true;
  }, []);
  
  // Check if user is scrolled to bottom
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;
    
    const { scrollHeight, scrollTop, clientHeight } = scrollAreaRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    
    // Consider "near bottom" as within 100px of the bottom
    isScrolledToBottomRef.current = scrollPosition < 100;
  }, []);
  
  // Scroll to bottom when new messages arrive if already at bottom
  useEffect(() => {
    if (isScrolledToBottomRef.current || messages.some(m => m.is_optimistic)) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);
  
  // Scroll when typing indicator appears
  useEffect(() => {
    if (isTyping && isScrolledToBottomRef.current) {
      scrollToBottom();
    }
  }, [isTyping, scrollToBottom]);
  
  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  // Group messages by date
  const groupedMessages: { [date: string]: DirectMessage[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  
  return (
    <ScrollArea 
      className="flex-1 p-4 overflow-y-auto relative"
      onScroll={handleScroll}
      ref={scrollAreaRef}
    >
      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 z-10 flex justify-center">
              <div className="bg-luxury-neutral/10 text-luxury-neutral/80 text-xs px-2 py-1 rounded-full">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </div>
            </div>
            
            {groupedMessages[date].map((message, index) => {
              const isCurrentUser = message.sender_id === currentUserId;
              const showAvatar = index === 0 || 
                groupedMessages[date][index - 1]?.sender_id !== message.sender_id;
              const isFailedMessage = message.delivery_status === 'failed';
              
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex gap-2 group",
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isCurrentUser && showAvatar ? (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={recipientProfile.avatar_url || ""} />
                      <AvatarFallback>
                        {recipientProfile.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 flex-shrink-0" />
                  )}
                  
                  <div 
                    className={cn(
                      "flex flex-col max-w-[75%] space-y-2",
                      isCurrentUser && "items-end"
                    )}
                  >
                    <MessageBubble 
                      message={message}
                      isOwnMessage={isCurrentUser}
                      currentUserId={currentUserId}
                      profile={isCurrentUser ? null : recipientProfile}
                      showAvatar={showAvatar}
                    />
                    
                    {isFailedMessage && onRetry && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 flex items-center gap-1 text-xs"
                        onClick={() => onRetry(message)}
                      >
                        <RefreshCcw size={12} />
                        Retry
                      </Button>
                    )}
                    
                    {message.is_optimistic && (
                      <div className="text-xs text-luxury-neutral/40 italic">
                        Sending...
                      </div>
                    )}
                    
                    {message.delivery_status === 'sent' && isCurrentUser && (
                      <div className="text-xs text-luxury-neutral/40">
                        Sent
                      </div>
                    )}
                    
                    {message.delivery_status === 'delivered' && isCurrentUser && (
                      <div className="text-xs text-luxury-neutral/40">
                        Delivered
                      </div>
                    )}
                    
                    {message.delivery_status === 'seen' && isCurrentUser && (
                      <div className="text-xs text-blue-400 font-medium">
                        Seen
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipientProfile.avatar_url || ""} />
              <AvatarFallback>
                {recipientProfile.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="bg-luxury-neutral/10 text-white px-4 py-2 rounded-lg rounded-bl-none inline-flex items-center space-x-1">
              <div className="w-2 h-2 bg-luxury-neutral/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-luxury-neutral/60 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-luxury-neutral/60 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
