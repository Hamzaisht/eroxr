import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

interface MessagePreviewProps {
  message: any;
  currentUserId: string | undefined;
  isSelected?: boolean;
}

export const MessagePreview = ({ message, currentUserId, isSelected }: MessagePreviewProps) => {
  const otherUser = message.sender_id === currentUserId ? message.recipient : message.sender;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? "bg-luxury-primary/10 hover:bg-luxury-primary/15" 
          : "hover:bg-luxury-neutral/5"
      }`}
    >
      <Avatar className="h-12 w-12 border-2 border-luxury-primary/20">
        <AvatarImage src={otherUser?.avatar_url} />
        <AvatarFallback className="bg-luxury-primary/20">
          {otherUser?.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-luxury-neutral truncate">
            {otherUser?.username}
          </p>
          <span className="text-xs text-luxury-neutral/50">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <p className="text-sm text-luxury-neutral/70 truncate flex-1">
            {message.content}
          </p>
          {message.sender_id === currentUserId && (
            message.viewed_at ? (
              <CheckCheck className="w-4 h-4 text-luxury-primary" />
            ) : (
              <Check className="w-4 h-4 text-luxury-neutral/50" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};