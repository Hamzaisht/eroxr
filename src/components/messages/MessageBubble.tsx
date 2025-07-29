
import { DirectMessage } from "@/integrations/supabase/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  currentUserId: string;
  profile?: {
    username: string;
    avatar_url?: string;
    online_status?: string;
  } | null;
  showAvatar?: boolean;
}

export const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserId, 
  profile, 
  showAvatar = true 
}: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex gap-2 max-w-[75%]",
      isOwnMessage ? "flex-row-reverse ml-auto" : "flex-row"
    )}>
      {!isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback>
            {profile?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-lg px-3 py-2 break-words",
        isOwnMessage 
          ? "bg-luxury-primary text-white rounded-br-none"
          : "bg-luxury-neutral/10 text-white rounded-bl-none"
      )}>
        {message.content && (
          <div className="text-sm">{message.content}</div>
        )}
        
        {message.media_url && message.media_url.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.media_url.map((url, index) => (
              <img 
                key={index}
                src={url} 
                alt="Message attachment" 
                className="max-w-full h-auto rounded"
              />
            ))}
          </div>
        )}
        
        <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
          <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
          {isOwnMessage && message.delivery_status && (
            <div className="flex items-center ml-2">
              {message.delivery_status === 'seen' ? (
                <CheckCheck className={cn(
                  "h-3 w-3",
                  "text-blue-400"
                )} />
              ) : message.delivery_status === 'delivered' ? (
                <CheckCheck className={cn(
                  "h-3 w-3", 
                  "text-white/40"
                )} />
              ) : (
                <Check className={cn(
                  "h-3 w-3",
                  "text-white/40"
                )} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
