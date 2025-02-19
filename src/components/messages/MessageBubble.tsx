
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { MediaViewer } from "../media/MediaViewer";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { MessageActions } from "./message-parts/MessageActions";
import { MessageContent } from "./message-parts/MessageContent";
import { MessageEditForm } from "./message-parts/MessageEditForm";

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  currentUserId: string | undefined;
  profile?: any;
}

interface MessageUpdateData {
  content: string;
  updated_at: string;
  original_content?: string;
}

export const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserId,
  profile 
}: MessageBubbleProps) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  const [localMessage, setLocalMessage] = useState(message);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset states when switching chats
  useEffect(() => {
    setIsEditing(false);
    setSelectedMedia(null);
    setEditedContent(message.content || "");
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      setTimeout(async () => {
        const { error } = await supabase
          .from('direct_messages')
          .delete()
          .eq('id', message.id);

        if (error) throw error;

        toast({
          description: "Message deleted successfully",
        });
      }, 500);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete message",
      });
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) return;
    
    try {
      setIsUpdating(true);
      
      const updateData: MessageUpdateData = {
        content: editedContent.trim(),
        updated_at: new Date().toISOString()
      };

      if (!message.original_content) {
        updateData.original_content = message.content;
      }

      const { error } = await supabase
        .from('direct_messages')
        .update(updateData)
        .eq('id', message.id);

      if (error) throw error;

      setLocalMessage({
        ...localMessage,
        content: editedContent.trim(),
        updated_at: updateData.updated_at,
        original_content: updateData.original_content || localMessage.original_content
      });

      setIsEditing(false);
      setSelectedMedia(null);
      
      toast({
        description: "Message updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        description: "Failed to update message",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedMedia(null);
                }}
                isUpdating={isUpdating}
                inputRef={inputRef}
              />
            ) : (
              <MessageContent
                message={localMessage}
                isOwnMessage={isOwnMessage}
                isEditing={isEditing}
                onMediaSelect={setSelectedMedia}
                onSnapView={handleSnapView}
              />
            )}
          </motion.div>
          
          <div className={`flex items-center space-x-1 mt-1 text-[10px] text-luxury-neutral/50
            ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <span>
              {formatDistanceToNow(new Date(localMessage.created_at || ''), { addSuffix: true })}
              {localMessage.content !== localMessage.original_content && (
                <span className="ml-1 text-luxury-primary/70">(edited)</span>
              )}
            </span>
            {isOwnMessage && canEditDelete && message.message_type !== 'snap' && (
              <MessageActions
                onEdit={() => {
                  setIsEditing(true);
                  setSelectedMedia(null);
                }}
                onDelete={handleDelete}
                hasContent={!!message.content}
              />
            )}
            {isOwnMessage && (
              message.viewed_at ? (
                <CheckCheck className="w-3 h-3 text-luxury-primary" />
              ) : (
                <Check className="w-3 h-3" />
              )
            )}
          </div>
        </div>
      </motion.div>

      {selectedMedia && !isEditing && (
        <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </AnimatePresence>
  );
};
