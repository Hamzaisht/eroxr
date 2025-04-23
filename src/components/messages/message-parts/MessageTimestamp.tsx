import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Pencil, Trash2, Reply, Clock } from "lucide-react";
import { MessageDeliveryStatus } from "@/integrations/supabase/types/message";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmojiPicker } from "./EmojiPicker";

interface MessageTimestampProps {
  createdAt: string;
  originalContent?: string | null;
  content?: string | null;
  isOwnMessage: boolean;
  canEditDelete: boolean;
  messageType?: string;
  viewedAt?: string | null;
  deliveryStatus?: MessageDeliveryStatus;
  onEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
  onReaction?: (emoji: string) => void;
}

export const MessageTimestamp = ({
  createdAt,
  originalContent,
  content,
  isOwnMessage,
  canEditDelete,
  messageType,
  viewedAt,
  deliveryStatus,
  onEdit,
  onDelete,
  onReply,
  onReaction
}: MessageTimestampProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { toast } = useToast();
  
  const isEdited = originalContent && content !== originalContent;
  const isSnapMessage = messageType === 'snap';
  const isViewedSnap = isSnapMessage && viewedAt;
  
  const handleActionToggle = () => {
    setShowActions(!showActions);
  };
  
  const handleReaction = (emoji: string) => {
    setShowEmojiPicker(false);
    if (onReaction) {
      onReaction(emoji);
      toast({
        description: `You reacted with ${emoji}`
      });
    }
  };
  
  const renderDeliveryStatus = () => {
    if (!isOwnMessage || !deliveryStatus) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(
              "inline-flex items-center ml-1",
              "message-status",
              deliveryStatus === 'sent' && "sent",
              deliveryStatus === 'delivered' && "delivered",
              deliveryStatus === 'seen' && "seen"
            )}>
              {deliveryStatus === 'seen' ? (
                <CheckCheck className="h-3 w-3" />
              ) : deliveryStatus === 'delivered' ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {deliveryStatus === 'seen' 
                ? 'Seen' 
                : deliveryStatus === 'delivered'
                  ? 'Delivered'
                  : 'Sent'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div 
      className={cn(
        "text-xs text-white/40 flex items-center space-x-1 px-1",
        isOwnMessage ? "justify-end" : "justify-start",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 z-10">
          <EmojiPicker onEmojiSelect={handleReaction} />
        </div>
      )}
      
      {showActions && !isViewedSnap && (
        <div className={cn(
          "flex items-center space-x-1 bg-black/30 rounded-full px-2 py-1 backdrop-blur-sm",
          isOwnMessage ? "mr-2" : "ml-2"
        )}>
          <button 
            onClick={() => setShowEmojiPicker(true)}
            className="hover:text-white/60 p-1 rounded-full hover:bg-white/10"
            aria-label="Add reaction"
          >
            <span className="text-sm">😊</span>
          </button>
          
          {onReply && (
            <button 
              onClick={onReply}
              className="hover:text-white/60 p-1 rounded-full hover:bg-white/10"
              aria-label="Reply"
            >
              <Reply className="h-3 w-3" />
            </button>
          )}
          
          {isOwnMessage && canEditDelete && content && (
            <button 
              onClick={onEdit}
              className="hover:text-white/60 p-1 rounded-full hover:bg-white/10"
              aria-label="Edit"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
          
          {isOwnMessage && canEditDelete && (
            <button 
              onClick={onDelete}
              className="hover:text-white/60 p-1 rounded-full hover:bg-white/10"
              aria-label="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      
      <span>
        {format(new Date(createdAt), 'h:mm a')}
      </span>
      
      {isEdited && <span>(edited)</span>}
      
      {isViewedSnap && (
        <span className="flex items-center text-luxury-accent">
          <Clock className="h-3 w-3 mr-1" />
          Viewed
        </span>
      )}
      
      {renderDeliveryStatus()}
    </div>
  );
};
