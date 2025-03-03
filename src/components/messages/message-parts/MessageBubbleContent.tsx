
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageContent } from "./MessageContent";
import { MessageEditForm } from "./MessageEditForm";

interface MessageBubbleContentProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  isEditing: boolean;
  editedContent: string;
  isUpdating: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  setEditedContent: (content: string) => void;
  handleEdit: () => void;
  cancelEditing: () => void;
  onMediaSelect: (url: string) => void;
  onSnapView: () => void;
}

export const MessageBubbleContent = ({
  message,
  isOwnMessage,
  isEditing,
  editedContent,
  isUpdating,
  inputRef,
  setEditedContent,
  handleEdit,
  cancelEditing,
  onMediaSelect,
  onSnapView
}: MessageBubbleContentProps) => {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl px-4 py-2",
        isOwnMessage 
          ? "bg-luxury-primary text-white" 
          : "bg-luxury-darker/50 backdrop-blur-sm text-luxury-neutral"
      )}
    >
      {isEditing ? (
        <MessageEditForm
          content={editedContent}
          onChange={setEditedContent}
          onSave={handleEdit}
          onCancel={cancelEditing}
          isUpdating={isUpdating}
          inputRef={inputRef}
        />
      ) : (
        <MessageContent
          message={message}
          isOwnMessage={isOwnMessage}
          isEditing={isEditing}
          onMediaSelect={onMediaSelect}
          onSnapView={onSnapView}
        />
      )}
    </motion.div>
  );
};
