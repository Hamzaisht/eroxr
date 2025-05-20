
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageActions } from './MessageActions';
import { SnapPreview } from './SnapPreview';
import { formatMessageTime } from '@/utils/date';
import { useUser } from '@/hooks/useUser';

// Define the Message interface to match what's expected
export interface Message {
  id: string;
  content?: string;
  media_url?: string[] | null;
  sender_id?: string;
  recipient_id?: string;
  created_at: string;
  delivery_status?: "sent" | "delivered" | "seen" | "failed";
  message_type?: string;
  video_url?: string;
  duration?: number;
  is_expired?: boolean;
  expires_at?: string;
  viewed_at?: string;
}

export interface MessageBubbleContentProps {
  message: Message;
  isOwnMessage: boolean;
  isEditing?: boolean;
  editedContent?: string;
  isUpdating?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  onSaveEdit?: () => Promise<void>;
  onCancelEdit?: () => void;
  onReport?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onEdit?: () => void;
  onSnapView?: () => Promise<void>;
  setEditedContent?: (content: string) => void;
  onMediaSelect?: (url: string) => void;
}

export const MessageBubbleContent = ({
  message,
  isOwnMessage,
  isEditing = false,
  editedContent = "",
  isUpdating = false,
  inputRef,
  onSaveEdit,
  onCancelEdit,
  onReport,
  onDelete,
  onEdit,
  onSnapView,
  setEditedContent,
  onMediaSelect
}: MessageBubbleContentProps) => {
  const [showActions, setShowActions] = useState(false);
  const { user } = useUser();
  
  const isSnap = message.message_type === 'snap';
  const isVideo = message.video_url || (message.media_url && message.media_url.some(url => url.match(/\.(mp4|webm|mov)$/i)));

  // Format message timestamp
  const formattedTime = formatMessageTime(message.created_at);

  // Handle actions menu toggle
  const toggleActions = () => {
    setShowActions(!showActions);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setEditedContent) {
      setEditedContent(e.target.value);
    }
  };

  return (
    <div className={`group relative flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwnMessage && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar_url || ""} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      )}

      <div className={`relative max-w-[75%] ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
        {isEditing ? (
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              defaultValue={editedContent}
              onChange={handleInputChange}
              className="w-full bg-transparent outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={onCancelEdit}
                className="text-xs text-foreground/80 hover:text-foreground"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={onSaveEdit}
                className="text-xs text-primary hover:text-primary/90"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {isSnap ? (
              <SnapPreview 
                message={message} 
                onSnapView={onSnapView} 
              />
            ) : (
              message.content && <p>{message.content}</p>
            )}
            {/* Time indicator */}
            <div className={`text-xs opacity-70 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
              {formattedTime}
            </div>
          </>
        )}
      </div>

      <MessageActions 
        onActionClick={(action) => {
          if (action === 'report') onReport?.();
          if (action === 'delete') onDelete?.();
          if (action === 'edit') onEdit?.();
        }}
        onReport={onReport} 
        onDelete={onDelete}
        onEdit={onEdit}
        isOwnMessage={isOwnMessage}
        isVisible={showActions}
        toggleVisibility={toggleActions}
      />
    </div>
  );
};
