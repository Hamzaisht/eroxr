import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";
import { Video, Play, File, Upload, X, MoreHorizontal, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isMediaLoadError, setIsMediaLoadError] = useState(false);
  
  const handleMediaLoad = () => {
    setIsMediaLoaded(true);
    setIsMediaLoadError(false);
  };
  
  const handleMediaError = () => {
    setIsMediaLoaded(true); // Still set to true to hide loader
    setIsMediaLoadError(true);
  };

  // Reset state when message changes
  useEffect(() => {
    setIsMediaLoaded(false);
    setIsMediaLoadError(false);
  }, [message.id]);

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
        : MediaType.DOCUMENT; // Change FILE to DOCUMENT;
      
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
      <motion.div 
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        className={cn(
          "relative p-2 rounded-2xl",
          isOwnMessage ? "bg-luxury-primary/30" : "bg-white/10"
        )}
      >
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
      </motion.div>
    );
  }

  // Regular message display
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut" 
      }}
      className={cn(
        "relative overflow-hidden max-w-full",
        isOwnMessage 
          ? "bg-gradient-to-br from-luxury-primary/30 to-luxury-primary/20 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl border border-white/5" 
          : "bg-gradient-to-br from-white/10 to-white/5 rounded-tr-2xl rounded-tl-sm rounded-br-2xl rounded-bl-2xl border border-white/5",
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
          className="cursor-pointer p-3 flex items-center space-x-2 hover:bg-black/10 transition-colors"
          onClick={onSnapView}
        >
          <motion.div 
            className="bg-luxury-primary/20 p-3 rounded-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Video className="w-5 h-5 text-luxury-primary" />
          </motion.div>
          <div className="text-sm">
            <div className="font-medium">Snap</div>
            <div className="text-xs text-white/60">Tap to view • Disappears after viewing</div>
          </div>
        </div>
      )}
      
      {/* Audio message */}
      {isAudioMessage && message.media_url && message.media_url[0] && (
        <div className="p-2">
          <audio
            controls
            src={message.media_url[0]}
            className="w-full"
            onLoadedData={handleMediaLoad}
            onError={handleMediaError}
          >
            Your browser does not support audio playback
          </audio>
          
          {!isMediaLoaded && (
            <div className="h-12 w-full bg-white/5 rounded flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-luxury-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      )}
      
      {/* Image message */}
      {hasMedia && !isVideoMessage && !isFileMessage && !isAudioMessage && (
        <div 
          className="media-attachment overflow-hidden cursor-pointer"
          onClick={() => onMediaSelect(mediaUrl)}
        >
          {!isMediaLoaded && !isMediaLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
              <div className="animate-spin h-5 w-5 border-2 border-luxury-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          {isMediaLoadError ? (
            <div className="h-40 flex flex-col items-center justify-center bg-black/20 p-4">
              <div className="text-red-400 mb-2">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="text-sm text-center text-white/70">
                Failed to load media
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(mediaUrl, '_blank')}
              >
                Open in new tab
              </Button>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <UniversalMedia
                item={{
                  media_url: mediaUrl,
                  media_type: MediaType.IMAGE
                }}
                className="max-w-full h-auto transition-transform"
                controls={false}
                onLoad={handleMediaLoad}
                onError={handleMediaError}
              />
            </motion.div>
          )}
        </div>
      )}
      
      {/* Video message */}
      {isVideoMessage && (
        <div
          className="relative overflow-hidden cursor-pointer"
          onClick={() => onMediaSelect(message.video_url || mediaUrl)}
        >
          {!isMediaLoaded && !isMediaLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
              <div className="animate-spin h-5 w-5 border-2 border-luxury-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          {isMediaLoadError ? (
            <div className="h-48 flex flex-col items-center justify-center bg-black/20 p-4">
              <div className="text-red-400 mb-2">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="text-sm text-center text-white/70">
                Failed to load video preview
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(message.video_url || mediaUrl, '_blank')}
              >
                Open in new tab
              </Button>
            </div>
          ) : (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <UniversalMedia
                  item={{
                    media_url: mediaUrl,
                    media_type: MediaType.IMAGE
                  }}
                  className="max-w-full h-auto max-h-80 object-contain"
                  controls={false}
                  onLoad={handleMediaLoad}
                  onError={handleMediaError}
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
      
      {/* File message */}
      {isFileMessage && mediaUrl && (
        <div className="p-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 p-3 rounded-lg flex items-center space-x-3 cursor-pointer"
            onClick={() => window.open(mediaUrl, '_blank')}
          >
            <div className="bg-luxury-primary/20 p-2 rounded">
              <File className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {mediaUrl.split('/').pop() || 'File'}
              </div>
              <div className="text-xs text-white/60">
                Click to download
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
