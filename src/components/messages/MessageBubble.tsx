
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { motion, AnimatePresence } from "framer-motion";
import { MediaViewer } from "../media/MediaViewer";
import { MessageBubbleContent } from "./message-parts/MessageBubbleContent";
import { MessageTimestamp } from "./message-parts/MessageTimestamp";
import { useMessageEdit } from "@/hooks/useMessageEdit";
import { useMessageDelete } from "@/hooks/useMessageDelete";

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  currentUserId: string | undefined;
  profile?: any;
}

export const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserId,
  profile 
}: MessageBubbleProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState(message);
  
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

  // Reset states when switching chats
  useEffect(() => {
    cancelEditing();
    setSelectedMedia(null);
    setLocalMessage(message);
  }, [message]);

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
            setEditedContent(payload.new.content);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [message.id]);

  const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
  const canEditDelete = messageAge < 24 * 60 * 60 * 1000;

  const handleSnapView = () => {
    if (!message.media_url?.[0]) return;
    setSelectedMedia(message.media_url[0]);

    if (message.message_type === 'snap' && !message.viewed_at) {
      supabase
        .from('direct_messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', message.id)
        .then(() => {
          setTimeout(() => {
            supabase
              .from('direct_messages')
              .delete()
              .eq('id', message.id);
          }, 2000);
        });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: isDeleting ? 0 : 1,
          scale: isDeleting ? 0 : 1,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
        className={`flex items-end space-x-2 mb-4 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isOwnMessage && (
          <div className="relative">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            {profile?.has_stories && (
              <div className="absolute inset-0 rounded-full animate-pulse-ring bg-gradient-to-tr from-luxury-primary to-luxury-accent opacity-75" />
            )}
          </div>
        )}
        
        <div className={`group max-w-[70%] space-y-2 ${isOwnMessage ? "items-end" : "items-start"}`}>
          <MessageBubbleContent
            message={localMessage}
            isOwnMessage={isOwnMessage}
            isEditing={isEditing}
            editedContent={editedContent}
            isUpdating={isUpdating}
            inputRef={inputRef}
            setEditedContent={setEditedContent}
            handleEdit={handleEdit}
            cancelEditing={cancelEditing}
            onMediaSelect={setSelectedMedia}
            onSnapView={handleSnapView}
          />
          
          <MessageTimestamp
            createdAt={localMessage.created_at}
            originalContent={localMessage.original_content}
            content={localMessage.content}
            isOwnMessage={isOwnMessage}
            canEditDelete={canEditDelete}
            messageType={message.message_type}
            viewedAt={message.viewed_at}
            onEdit={startEditing}
            onDelete={handleDelete}
          />
        </div>
      </motion.div>

      {selectedMedia && !isEditing && (
        <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </AnimatePresence>
  );
};
