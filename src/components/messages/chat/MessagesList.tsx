import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

interface MessagesListProps {
  messages: Message[];
  currentUserId: string | undefined;
  editingMessageId: string | null;
  editingContent: string;
  userScrolled: boolean;
  onUserScrolledChange: (scrolled: boolean) => void;
  onStartEditing: (messageId: string, content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditingContentChange: (content: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessagesList = ({
  messages,
  currentUserId,
  editingMessageId,
  editingContent,
  userScrolled,
  onUserScrolledChange,
  onStartEditing,
  onEditMessage,
  onDeleteMessage,
  onEditingContentChange,
  onKeyPress
}: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!userScrolled) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, userScrolled]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div 
        className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6"
        onScroll={(e) => {
          const element = e.currentTarget;
          const isScrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
          onUserScrolledChange(!isScrolledToBottom);
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                currentUserId={currentUserId}
                editingMessageId={editingMessageId}
                editingContent={editingContent}
                onStartEditing={onStartEditing}
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                onEditingContentChange={onEditingContentChange}
                onKeyPress={onKeyPress}
              />
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};