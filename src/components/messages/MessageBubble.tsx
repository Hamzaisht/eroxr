
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      username: string;
      avatar_url?: string;
    };
    created_at: string;
  };
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.avatar_url} />
        <AvatarFallback>
          {message.sender.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'text-right' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.content}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
