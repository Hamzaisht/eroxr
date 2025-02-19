
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

interface MessagePreviewProps {
  message: any;
  currentUserId: string | undefined;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MessagePreview = ({ message, currentUserId, isSelected, onClick }: MessagePreviewProps) => {
  const otherUser = message.sender_id === currentUserId ? message.recipient : message.sender;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? "bg-white/5" 
          : "hover:bg-white/5"
      }`}
    >
      <Avatar className="h-12 w-12 border-2 border-white/5">
        <AvatarImage src={otherUser?.avatar_url} />
        <AvatarFallback className="bg-white/5 text-white">
          {otherUser?.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white/90 truncate">
            {otherUser?.username}
          </p>
          <span className="text-xs text-white/40">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <p className="text-sm text-white/60 truncate flex-1">
            {message.content}
          </p>
          {message.sender_id === currentUserId && (
            message.viewed_at ? (
              <CheckCheck className="w-4 h-4 text-blue-400" />
            ) : (
              <Check className="w-4 h-4 text-white/40" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};
