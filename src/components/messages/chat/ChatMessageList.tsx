
import React, { useRef, useEffect } from "react";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatMessageListProps {
  messages: DirectMessage[];
  currentUserId: string;
  recipientProfile: {
    username: string;
    avatar_url?: string;
  };
  isTyping?: boolean;
}

export const ChatMessageList = ({ 
  messages, 
  currentUserId, 
  recipientProfile,
  isTyping
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <ScrollArea className="flex-1 p-4">
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
              
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex gap-2",
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {!isCurrentUser && showAvatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={recipientProfile.avatar_url || ""} />
                      <AvatarFallback>
                        {recipientProfile.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8" />
                  )}
                  
                  <div 
                    className={cn(
                      "flex flex-col max-w-[75%] space-y-2",
                      isCurrentUser && "items-end"
                    )}
                  >
                    {message.content && (
                      <div 
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm",
                          isCurrentUser 
                            ? "bg-luxury-primary/80 text-white rounded-br-none" 
                            : "bg-luxury-neutral/10 text-white rounded-bl-none"
                        )}
                      >
                        {message.content}
                      </div>
                    )}
                    
                    {message.media_url && message.media_url.length > 0 && (
                      <div className="space-y-2 max-w-[240px]">
                        {message.media_url.map((url, i) => (
                          <div 
                            key={`${message.id}-media-${i}`}
                            className="rounded-lg overflow-hidden bg-luxury-neutral/10"
                          >
                            {/* Implement media preview component here */}
                            {/* For simplicity, showing text link */}
                            <div className="p-2 text-xs text-luxury-neutral/80 underline">
                              {url.split('/').pop()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className={cn(
                        "text-xs text-luxury-neutral/60",
                        isCurrentUser ? "text-right" : "text-left"
                      )}
                    >
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
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
