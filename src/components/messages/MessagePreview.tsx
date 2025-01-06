import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface MessagePreviewProps {
  message: any;
  currentUserId: string | undefined;
}

export const MessagePreview = ({ message, currentUserId }: MessagePreviewProps) => {
  const otherUser = message.sender_id === currentUserId ? message.recipient : message.sender;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
    >
      <Avatar>
        <AvatarImage src={otherUser?.avatar_url} />
        <AvatarFallback>
          {otherUser?.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{otherUser?.username}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
};