
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessagePreviewProps {
  message: any;
  currentUserId: string | undefined;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MessagePreview = ({ message, currentUserId, isSelected, onClick }: MessagePreviewProps) => {
  const otherUser = message.sender_id === currentUserId ? message.recipient : message.sender;
  const isUnread = !message.viewed_at && message.recipient_id === currentUserId;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
        isSelected ? "bg-white/10" : "hover:bg-white/5",
        isUnread && "bg-blue-500/10 hover:bg-blue-500/20"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-white/5">
          <AvatarImage src={otherUser?.avatar_url} />
          <AvatarFallback className="bg-white/5 text-white">
            {otherUser?.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        {otherUser?.status === 'online' && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#0D1117]" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={cn(
            "font-medium truncate",
            isUnread ? "text-white" : "text-white/90"
          )}>
            {otherUser?.username}
          </p>
          <span className="text-xs text-white/40 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <p className={cn(
            "text-sm truncate flex-1",
            isUnread ? "text-white/90 font-medium" : "text-white/60"
          )}>
            {message.sender_id === currentUserId && "You: "}{message.content}
          </p>
          {message.sender_id === currentUserId && (
            message.viewed_at ? (
              <CheckCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-white/40 flex-shrink-0" />
            )
          )}
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
