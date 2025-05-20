
import { useRef, useState, RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SnapPreview } from "./SnapPreview";
import { formatMessageTime } from "@/utils/date";
import { useUser } from "@/hooks/useUser";

export interface MessageBubbleContentProps {
  message: any;
  isOwnMessage: boolean;
  isEditing: boolean;
  editedContent: string;
  isUpdating: boolean;
  inputRef: RefObject<HTMLInputElement>;
  setEditedContent: (content: string) => void;
  handleEdit: () => void;
  cancelEditing: () => void;
  onMediaSelect?: (url: string) => void;
  onSnapView?: () => void;
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
  const [isHovering, setIsHovering] = useState(false);
  const { currentUser } = useUser();
  
  // Function to render media content if present
  const renderMediaContent = () => {
    if (!message.media_url || message.media_url.length === 0) return null;
    
    // For snap messages, render specialized preview
    if (message.message_type === 'snap') {
      return (
        <SnapPreview
          message={message}
          onClick={onSnapView}
        />
      );
    }
    
    // For regular media
    return (
      <div className="space-y-2 mt-2">
        {message.media_url.map((url: string, index: number) => {
          if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
            return (
              <div key={index} className="relative rounded-md overflow-hidden">
                <img
                  src={url}
                  alt="Media"
                  className="max-w-[250px] max-h-[250px] object-cover rounded-md cursor-pointer"
                  onClick={() => onMediaSelect?.(url)}
                />
              </div>
            );
          } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return (
              <div key={index} className="relative rounded-md overflow-hidden">
                <video
                  controls
                  className="max-w-[250px] max-h-[250px] object-cover rounded-md"
                >
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group relative",
        isOwnMessage ? "items-end" : "items-start"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "px-4 py-3 rounded-xl max-w-md break-words",
          isOwnMessage
            ? "bg-luxury-primary text-white rounded-br-none"
            : "bg-gray-800 text-white rounded-bl-none"
        )}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] bg-gray-900 border-gray-700"
              placeholder="Edit your message..."
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEditing}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={isUpdating || !editedContent.trim()}
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            {renderMediaContent()}
          </>
        )}
      </div>
    </div>
  );
};
