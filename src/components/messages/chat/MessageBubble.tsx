import { motion } from 'framer-motion';
import { MessageActions } from '../MessageActions';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string | undefined;
  editingMessageId: string | null;
  editingContent: string;
  onStartEditing: (messageId: string, content: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditingContentChange: (content: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessageBubble = ({
  message,
  isOwn,
  currentUserId,
  editingMessageId,
  editingContent,
  onStartEditing,
  onEditMessage,
  onDeleteMessage,
  onEditingContentChange,
  onKeyPress
}: MessageBubbleProps) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`group relative max-w-xs lg:max-w-md transition-all duration-300 hover:scale-[1.02] ${
          isOwn ? 'ml-auto' : 'mr-auto'
        }`}
      >
        {/* Message Actions */}
        {isOwn && (
          <div className="absolute -top-2 -right-2 z-20">
            <MessageActions 
              messageId={message.id}
              messageContent={message.content}
              isOwnMessage={isOwn}
              onEdit={onStartEditing}
              onDelete={onDeleteMessage}
            />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative overflow-hidden px-5 py-3 ${
            isOwn
              ? 'bg-gradient-to-r from-primary via-primary/90 to-purple-500 text-white shadow-xl shadow-primary/30 rounded-3xl rounded-br-lg'
              : 'bg-white/[0.08] backdrop-blur-xl text-white border border-white/20 shadow-lg shadow-white/10 rounded-3xl rounded-bl-lg'
          }`}
        >
          {/* Message content */}
          {editingMessageId === message.id ? (
            <input
              value={editingContent}
              onChange={(e) => onEditingContentChange(e.target.value)}
              onKeyPress={onKeyPress}
              className="w-full bg-transparent border-none outline-none text-white"
              autoFocus
            />
          ) : (
            <p className="text-sm leading-relaxed relative z-10 font-medium">{message.content}</p>
          )}
          
          {/* Timestamp */}
          <div className={`flex items-center gap-2 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <p className={`text-xs font-mono relative z-10 ${
              isOwn ? 'text-white/80' : 'text-white/60'
            }`}>
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {isOwn && (
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <div className="w-1 h-1 bg-white/60 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};