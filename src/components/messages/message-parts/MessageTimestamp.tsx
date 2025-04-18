
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  MoreVertical,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MessageDeliveryStatus, MessageType } from "@/integrations/supabase/types/message";
import { cn } from "@/lib/utils";

interface MessageTimestampProps {
  createdAt: string;
  originalContent?: string | null;
  content?: string | null;
  isOwnMessage: boolean;
  canEditDelete: boolean;
  messageType?: MessageType;
  viewedAt?: string | null;
  deliveryStatus?: MessageDeliveryStatus;
  onEdit: () => void;
  onDelete: () => void;
}

export const MessageTimestamp = ({
  createdAt,
  originalContent,
  content,
  isOwnMessage,
  canEditDelete,
  messageType,
  viewedAt,
  deliveryStatus = "sent",
  onEdit,
  onDelete
}: MessageTimestampProps) => {
  const [showActions, setShowActions] = useState(false);
  
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  
  const isEdited = originalContent && content && originalContent !== content;
  
  const renderDeliveryStatus = () => {
    if (!isOwnMessage) return null;
    
    switch (deliveryStatus) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "seen":
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[10px] px-0.5",
        isOwnMessage ? "justify-end" : "justify-start",
        showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {messageType === "snap" && viewedAt && (
        <Clock className="h-3 w-3 text-red-400" />
      )}
      
      <span className="text-luxury-neutral/50">
        {formattedTime}
      </span>
      
      {isEdited && (
        <span className="text-luxury-neutral/50 ml-1">(edited)</span>
      )}
      
      {renderDeliveryStatus()}
      
      <AnimatePresence>
        {showActions && isOwnMessage && canEditDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none ml-1">
                  <MoreVertical className="h-3 w-3 text-luxury-neutral/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-luxury-darker border border-white/10 text-luxury-neutral"
              >
                {content && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={onEdit}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
