
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Pencil, Trash2, Reply, Clock, Heart, ThumbsUp, MoreHorizontal, Smile } from "lucide-react";
import { MessageDeliveryStatus } from "@/integrations/supabase/types/message";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmojiPicker } from "./EmojiPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { toast } = useToast();
  
  const isEdited = originalContent && content !== originalContent;
  const isSnapMessage = messageType === 'snap';
  const isViewedSnap = isSnapMessage && viewedAt;
  
  const handleReaction = (emoji: string) => {
    setShowEmojiPicker(false);
    if (onReaction) {
      onReaction(emoji);
      toast({
        description: `You reacted with ${emoji}`
      });
    }
  };

  const quickReactions = ["❤️", "👍", "😂", "😮", "😢"];
  
  const renderDeliveryStatus = () => {
    if (!isOwnMessage || !deliveryStatus) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(
              "inline-flex items-center ml-1",
              deliveryStatus === 'sent' && "text-white/40",
              deliveryStatus === 'delivered' && "text-blue-400/60",
              deliveryStatus === 'seen' && "text-blue-400"
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
          <TooltipContent side={isOwnMessage ? "left" : "right"} className="bg-black/80 text-white text-xs">
            {deliveryStatus === 'sent' ? "Sent" : 
             deliveryStatus === 'delivered' ? "Delivered" : 
             "Seen"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderMessageControls = () => {
    if (!canEditDelete) return null;
    
    const hasContent = !!content && !isViewedSnap;
    
    return (
      <div className="absolute bottom-0 right-0 translate-y-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-luxury-darker rounded-full shadow-md border border-white/5 flex items-center p-1 space-x-1">
          {/* Quick reactions */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="hover:bg-white/10 rounded-full p-1.5"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  <Smile className="h-3.5 w-3.5 text-white/80" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/80 text-white text-xs">
                React
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {hasContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="hover:bg-white/10 rounded-full p-1.5"
                    onClick={onEdit}
                  >
                    <Pencil className="h-3.5 w-3.5 text-white/80" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/80 text-white text-xs">
                  Edit
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onReply && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="hover:bg-white/10 rounded-full p-1.5"
                    onClick={onReply}
                  >
                    <Reply className="h-3.5 w-3.5 text-white/80" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/80 text-white text-xs">
                  Reply
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-white/10 rounded-full p-1.5">
                      <MoreHorizontal className="h-3.5 w-3.5 text-white/80" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/80 text-white text-xs">
                  More options
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent align="center" className="bg-black/90 backdrop-blur-md border-white/10 text-xs">
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 cursor-pointer">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-10 right-0">
            <EmojiPicker 
              onEmojiSelect={handleReaction}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    );
  };
  
  // Quick reactions bar that appears on hover
  const renderQuickReactions = () => {
    if (!onReaction) return null;
    
    return (
      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-white/5 flex items-center p-1.5 space-x-1">
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              className="hover:bg-white/10 px-1.5 py-1 rounded-full text-sm transition-transform hover:scale-125"
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="text-[10px] flex items-center text-white/50 px-1 relative">
      <span className="whitespace-nowrap">
        {format(new Date(createdAt), 'h:mm a')}
      </span>
      
      {isEdited && (
        <span className="ml-1 italic">
          (edited)
        </span>
      )}
      
      {renderDeliveryStatus()}
      
      {renderMessageControls()}
      {renderQuickReactions()}
    </div>
  );
};
