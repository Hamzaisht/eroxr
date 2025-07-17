
import { useRef, useState, RefObject } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SnapPreview } from "./SnapPreview";
import { SnapViewerModal } from "../SnapViewerModal";
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
  const [showSnapViewer, setShowSnapViewer] = useState(false);
  const { currentUser } = useUser();
  
  // Function to render media content if present
  const renderMediaContent = () => {
    if (!message.media_url || message.media_url.length === 0) return null;
    
    // For snap messages, render specialized preview
    if (message.message_type === 'snap') {
      return (
        <>
          <SnapPreview
            message={message}
            onClick={() => setShowSnapViewer(true)}
          />
          <SnapViewerModal
            isOpen={showSnapViewer}
            onClose={() => setShowSnapViewer(false)}
            snapUrl={message.media_url?.[0] || ''}
            isVideo={message.media_url?.[0]?.includes('.webm')}
            duration={message.duration || 10}
          />
        </>
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
          "relative px-6 py-4 max-w-md break-words backdrop-blur-lg transition-all duration-500",
          isOwnMessage
            ? "ml-12 rounded-[20px] rounded-br-none"
            : "mr-12 rounded-[20px] rounded-bl-none"
        )}
        style={{
          background: isOwnMessage 
            ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(160, 82, 45, 0.1) 50%, rgba(139, 69, 19, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: isOwnMessage
            ? '0 8px 32px rgba(139, 69, 19, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          border: 'none'
        }}
      >
        {/* Luxury glow effect */}
        <div 
          className="absolute inset-0 rounded-[20px] transition-opacity duration-500"
          style={{
            background: isOwnMessage
              ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, transparent 50%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            opacity: isHovering ? 1 : 0
          }}
        />
        
        {isEditing ? (
          <div className="space-y-2 relative z-10">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] bg-black/20 border-none backdrop-blur-sm text-white placeholder:text-white/50"
              placeholder="Edit your message..."
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEditing}
                disabled={isUpdating}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={isUpdating || !editedContent.trim()}
                className="bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500/80 hover:to-amber-400/80 text-white border-none"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div 
              className="whitespace-pre-wrap text-sm font-light leading-relaxed tracking-wide"
              style={{
                color: isOwnMessage ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {message.content}
            </div>
            {renderMediaContent()}
          </div>
        )}
        
        {/* Message time with luxury styling */}
        <div 
          className={cn(
            "text-xs font-light tracking-wider mt-2 transition-opacity duration-300",
            isHovering ? "opacity-100" : "opacity-60"
          )}
          style={{
            color: isOwnMessage ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.5)'
          }}
        >
          {formatMessageTime(message.created_at)}
        </div>
      </div>
    </div>
  );
};
