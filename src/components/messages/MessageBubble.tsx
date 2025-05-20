import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { MediaViewer } from "../media/MediaViewer";
import { MessageBubbleContent } from "./message-parts/MessageBubbleContent";
import { MessageTimestamp } from "./message-parts/MessageTimestamp";
import { useMessageEdit } from "@/hooks/useMessageEdit";
import { useMessageDelete } from "@/hooks/useMessageDelete";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Shield, Ghost } from "lucide-react";
import { getPlayableMediaUrl } from "@/utils/media/urlUtils";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  currentUserId: string | undefined;
  profile?: any;
  previousMessage?: DirectMessage;
  showAvatar?: boolean;
}

export const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserId,
  profile,
  previousMessage,
  showAvatar = true
}: MessageBubbleProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState(message);
  const { isGhostMode = false } = useGhostMode();
  const messageRef = useRef<HTMLDivElement>(null);
  
  const { 
    isEditing, 
    editedContent, 
    isUpdating, 
    inputRef, 
    setEditedContent, 
    startEditing, 
    cancelEditing, 
    handleEdit 
  } = useMessageEdit(message);
  
  const { isDeleting, handleDelete } = useMessageDelete(message.id);

  // Determine whether to group messages based on sender and timing
  const shouldGroupWithPrevious = previousMessage && 
    previousMessage.sender_id === message.sender_id &&
    new Date(message.created_at).getTime() - new Date(previousMessage.created_at).getTime() < 60000;

  useEffect(() => {
    cancelEditing();
    setSelectedMedia(null);
    setLocalMessage(message);
  }, [message, cancelEditing]);

  useEffect(() => {
    const channel = supabase
      .channel('message-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `id=eq.${message.id}`
        },
        (payload: any) => {
          if (payload.new) {
            setLocalMessage(payload.new);
            if (payload.new.content) {
              setEditedContent(payload.new.content);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [message.id, setEditedContent]);

  const messageAge = new Date().getTime() - new Date(message.created_at || new Date()).getTime();
  const canEditDelete = messageAge < 24 * 60 * 60 * 1000;

  // Add a smooth scroll into view effect for new messages
  useEffect(() => {
    if (message.sender_id === currentUserId && messageRef.current) {
      setTimeout(() => {
        messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [message.id, message.sender_id, currentUserId]);

  const handleMediaView = async (url: string) => {
    if (!url) return;
    setSelectedMedia(url);
    
    if (isGhostMode) {
      if (currentUserId) {
        await supabase.from('admin_audit_logs').insert({
          user_id: currentUserId,
          action: 'ghost_view_media',
          details: {
            message_id: message.id,
            media_url: url,
            timestamp: new Date().toISOString()
          }
        });
      }
      return;
    }

    if (message.message_type !== 'snap') {
      return;
    }
    
    if (!message.viewed_at) {
      await supabase
        .from('direct_messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', message.id);

      if (message.expires_at) {
        setTimeout(() => {
          supabase
            .from('direct_messages')
            .delete()
            .eq('id', message.id);
        }, 5000);
      }
    }
  };

  const isDeletedSnap = message.message_type === 'snap' && message.viewed_at && isGhostMode;
  
  // Animation variants
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    },
    deleting: {
      opacity: 0,
      scale: 0.9,
      x: isOwnMessage ? 50 : -50,
      transition: {
        duration: 0.25
      }
    }
  };
  
  const statusVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.2 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={messageRef}
        layout
        initial="initial"
        animate={isDeleting ? "deleting" : "animate"}
        exit="exit"
        variants={bubbleVariants}
        className={cn(
          "relative flex items-end gap-2 mb-1",
          isOwnMessage ? "flex-row-reverse mr-2" : "ml-2",
          !shouldGroupWithPrevious && "mt-4",
          shouldGroupWithPrevious && "mt-1"
        )}
      >
        {isDeletedSnap && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white border border-red-500/30 shadow-lg flex items-center space-x-1"
            >
              <Ghost className="h-3.5 w-3.5 text-purple-400" />
              <span>Deleted snap - Ghost view</span>
            </motion.div>
          </div>
        )}
        
        {!isOwnMessage && showAvatar && !shouldGroupWithPrevious && (
          <div className="relative flex-shrink-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            {profile?.has_stories && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-luxury-primary to-luxury-accent opacity-75 animate-pulse-ring" />
            )}
          </div>
        )}

        {!isOwnMessage && (!showAvatar || shouldGroupWithPrevious) && (
          <div className="w-7 flex-shrink-0"></div>
        )}
        
        <div className={cn(
          "group max-w-[75%] space-y-1", 
          isOwnMessage ? "items-end" : "items-start"
        )}>
          <MessageBubbleContent
            message={{
              ...localMessage,
              // Convert delivery_status to the format expected by MessageBubbleContent
              delivery_status: 
                (localMessage.delivery_status === 'sending' || 
                 localMessage.delivery_status === 'failed' || 
                 localMessage.delivery_status === 'delivered' || 
                 localMessage.delivery_status === 'seen' ||
                 localMessage.delivery_status === 'sent') 
                  ? localMessage.delivery_status 
                  : (localMessage.viewed_at ? 'seen' : 'sent')
            } as any}
            isOwnMessage={isOwnMessage}
            isEditing={isEditing}
            editedContent={editedContent}
            isUpdating={isUpdating}
            inputRef={inputRef}
            setEditedContent={setEditedContent}
            handleEdit={handleEdit}
            cancelEditing={cancelEditing}
            onMediaSelect={handleMediaView}
            onSnapView={() => handleMediaView(message.media_url?.[0] || '')}
          />
          
          <MessageTimestamp
            createdAt={localMessage.created_at}
            originalContent={localMessage.original_content}
            content={localMessage.content}
            isOwnMessage={isOwnMessage}
            canEditDelete={canEditDelete}
            messageType={message.message_type}
            viewedAt={message.viewed_at}
            deliveryStatus={message.delivery_status || (message.viewed_at ? 'seen' : 'sent')}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        </div>

        {isOwnMessage && message.delivery_status === 'seen' && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={statusVariants}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-blue-400 absolute -bottom-4 right-2 font-medium">
                    Seen
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/80 text-white border-white/10">
                  <p>Read {message.viewed_at ? format(new Date(message.viewed_at), 'h:mm a') : ''}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </motion.div>

      {selectedMedia && !isEditing && (
        <MediaViewer 
          media={selectedMedia} 
          onClose={() => setSelectedMedia(null)}
          creatorId={message.sender_id || undefined}
        />
      )}
    </AnimatePresence>
  );
};
