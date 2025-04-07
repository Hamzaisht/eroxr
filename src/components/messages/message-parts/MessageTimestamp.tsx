
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { MessageActions } from "./MessageActions";

interface MessageTimestampProps {
  createdAt: string | null;
  originalContent: string | null;
  content: string | null;
  isOwnMessage: boolean;
  canEditDelete: boolean;
  messageType: string | null;
  viewedAt: string | null;
  deliveryStatus?: 'sent' | 'delivered' | 'seen' | null;
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
  deliveryStatus = 'sent',
  onEdit,
  onDelete
}: MessageTimestampProps) => {
  return (
    <div className={`flex items-center space-x-1 mt-1 text-[10px] text-luxury-neutral/50
      ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <span>
        {createdAt && formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        {content !== originalContent && (
          <span className="ml-1 text-luxury-primary/70">(edited)</span>
        )}
      </span>
      
      {isOwnMessage && canEditDelete && messageType !== 'snap' && messageType !== 'call' && (
        <MessageActions
          onEdit={onEdit}
          onDelete={onDelete}
          hasContent={!!content}
        />
      )}
      
      {isOwnMessage && (
        deliveryStatus === 'seen' ? (
          <CheckCheck className="w-3 h-3 text-luxury-primary" />
        ) : deliveryStatus === 'delivered' ? (
          <CheckCheck className="w-3 h-3" />
        ) : (
          <Check className="w-3 h-3" />
        )
      )}
    </div>
  );
};
