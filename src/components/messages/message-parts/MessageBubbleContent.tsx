
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";
import { Video, Play, File, Upload, X, MoreHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  replyToMessage?: DirectMessage | null;
  onReplyCancel?: () => void;
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
  onSnapView,
  replyToMessage,
  onReplyCancel
}: MessageBubbleContentProps) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  
  const handleMediaLoad = () => {
    setIsMediaLoaded(true);
  };
  
  const handleMediaError = () => {
    setIsMediaLoaded(true); // Still set to true to hide loader
  };

  // Determine if message contains media (image or video)
  const hasMedia = message.media_url && message.media_url.length > 0;
  const hasVideo = message.video_url || (message.media_url && message.media_url.some(url => 
    url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov')
  ));

  // Determine message type for proper rendering
  const isSnapMessage = message.message_type === 'snap';
  const isMediaMessage = message.message_type === 'media';
  const isVideoMessage = message.message_type === 'video' || hasVideo;
  const isFileMessage = message.message_type === 'document';
  const isAdMessage = message.message_type === 'ad_message';
  const isAudioMessage = message.message_type === 'audio';
  const isTextMessage = message.content && !isMediaMessage && !isVideoMessage && !isSnapMessage && !isFileMessage && !isAdMessage;

  // For JSON content in ad messages
  const parseAdContent = () => {
    if (isAdMessage && message.content) {
      try {
        return JSON.parse(message.content);
      } catch (e) {
        return { text: message.content };
      }
    }
    return null;
  };
  
  const adContent = parseAdContent();

  // Handle media URLs
  const mediaUrl = message.media_url?.[0] || '';
  const mediaType = mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) 
    ? MediaType.IMAGE 
    : mediaUrl.match(/\.(mp4|webm|mov)$/i) 
      ? MediaType.VIDEO 
      : mediaUrl.match(/\.(mp3|m4a|wav|ogg|webm)$/i)
        ? MediaType.AUDIO
        : MediaType.FILE;
      
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  // Render reply preview if this message is replying to another
  const renderReplyPreview = () => {
    if (!replyToMessage) return null;
    
    return (
      <div className="message-reply-container flex items-center text-xs text-gray-300 bg-white/5 rounded px-2 py-1 mb-1">
        <div className="flex-1 truncate">
          <span className="font-semibold mr-1">
            {isOwnMessage ? "You" : "Them"}:
          </span>
          {replyToMessage.content || (replyToMessage.media_url ? "Media" : "Message")}
        </div>
        {onReplyCancel && (
          <button 
            onClick={onReplyCancel} 
            className="p-1 hover:bg-white/10 rounded-full"
            aria-label="Cancel reply"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  };

  // Editing mode
  if (isEditing) {
    return (
      <div className={cn(
        "relative p-2 rounded-2xl",
        isOwnMessage ? "bg-luxury-primary/30" : "bg-white/10"
      )}>
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className={cn(
            "bg-transparent w-full p-2 focus:outline-none text-white resize-none rounded",
            isUpdating && "opacity-50"
          )}
          disabled={isUpdating}
        />
        <div className="flex items-center justify-end space-x-2 mt-2">
          <button
            onClick={cancelEditing}
            className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="text-xs px-2 py-1 rounded bg-luxury-primary/30 hover:bg-luxury-primary/50"
            disabled={isUpdating || !editedContent.trim()}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  // Regular message display
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden max-w-full",
        isOwnMessage 
          ? "bg-gradient-to-br from-luxury-primary/30 to-luxury-primary/20 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl" 
          : "bg-gradient-to-br from-white/10 to-white/5 rounded-tr-2xl rounded-tl-sm rounded-br-2xl rounded-bl-2xl",
      )}
    >
      {renderReplyPreview()}
      
      {/* Text message */}
      {isTextMessage && (
        <div className={cn(
          "p-3 break-words text-sm",
          isOwnMessage ? "text-white/95" : "text-white/90"
        )}>
          {message.content}
        </div>
      )}
      
      {/* Ad message */}
      {adContent && (
        <div className={cn(
          "p-3 break-words text-sm",
          isOwnMessage ? "text-white/95" : "text-white/90"
        )}>
          <div className="border-l-2 border-luxury-primary/50 pl-2">
            <div className="text-xs text-luxury-primary/80 mb-1">
              Ad Message
            </div>
            <div>{adContent.text || message.content}</div>
          </div>
        </div>
      )}

      {/* Snap message */}
      {isSnapMessage && !message.viewed_at && (
        <div 
          className="cursor-pointer p-3 flex items-center space-x-2"
          onClick={onSnapView}
        >
          <div className="bg-luxury-primary/20 p-3 rounded-full">
            <Video className="w-5 h-5 text-luxury-primary" />
          </div>
          <div className="text-sm">
            <div className="font-medium">Snap</div>
            <div className="text-xs text-white/60">Tap to view • Disappears after viewing</div>
          </div>
        </div>
      )}
      
      {/* Image message */}
      {hasMedia && !isVideoMessage && !isFileMessage && !isAudioMessage && (
        <div 
          className="media-attachment overflow-hidden rounded-lg"
          onClick={() => onMediaSelect(mediaUrl)}
        >
          <UniversalMedia
            item={{
              media_url: mediaUrl,
              media_type: MediaType.IMAGE
            }}
            className="max-w-full h-auto cursor-pointer transition-transform hover:scale-[1.02]"
            controls={false}
            onLoad={handleMediaLoad}
            onError={handleMediaError}
          />
          
          {!isMediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="animate-spin h-5 w-5 border-2 border-luxury-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      )}
      
      {/* Video message */}
      {isVideoMessage && (
        <div 
          className="media-attachment relative rounded-lg overflow-hidden"
          onClick={() => onMediaSelect(message.video_url || mediaUrl)}
        >
          <div className="aspect-video bg-black/30 flex items-center justify-center">
            {message.media_url?.[0] && (
              <img 
                src={message.media_url[0].replace(/\.(mp4|webm|mov)$/i, '.jpg')} 
                alt="Video thumbnail" 
                className="w-full h-auto object-contain"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-luxury-primary/60 backdrop-blur-md p-3 rounded-full">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio message */}
      {isAudioMessage && (
        <div className="p-3">
          <div className="bg-white/5 p-3 rounded-lg">
            <audio 
              src={mediaUrl}
              controls
              className="w-full"
              onLoadedData={handleMediaLoad}
              onError={handleMediaError}
            />
            <div className="text-xs text-white/60 mt-1">Voice message</div>
          </div>
        </div>
      )}
      
      {/* File message */}
      {isFileMessage && (
        <div 
          className="p-3 flex items-center space-x-2 cursor-pointer"
          onClick={() => onMediaSelect(message.document_url || '')}
        >
          <div className="bg-luxury-primary/10 p-2 rounded">
            <File className="h-5 w-5 text-luxury-primary/80" />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {message.document_url?.split('/').pop() || 'Document'}
            </div>
            <div className="text-xs text-white/60">Click to open</div>
          </div>
        </div>
      )}

      {/* Message reactions */}
      {message.reactions && message.reactions.length > 0 && (
        <div className="bg-black/20 px-3 py-1.5 rounded-full absolute -bottom-2 left-4 shadow-md flex items-center space-x-1">
          {message.reactions.map((reaction, index) => (
            <div key={index} className={cn(
              "px-1 py-0.5 rounded-md text-sm",
              reaction.users.includes(message.sender_id) && "bg-luxury-primary/20"
            )}>
              <span>{reaction.emoji}</span>
              <span className="ml-1 text-xs">{reaction.users.length}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Encrypted message fallback */}
      {!isTextMessage && !adContent && !isSnapMessage && !hasMedia && !isVideoMessage && !isFileMessage && !isAudioMessage && (
        <div className="text-luxury-neutral/50 italic flex items-center justify-center gap-2 p-3">
          <Lock className="h-3 w-3" />
          <span className="text-sm">Encrypted message</span>
        </div>
      )}
    </motion.div>
  );
};
