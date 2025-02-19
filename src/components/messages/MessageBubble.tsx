import { VideoMessage } from "./VideoMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck, MoreVertical, Camera, Trash2, Edit, X } from "lucide-react";
import { MediaViewer } from "../media/MediaViewer";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface MessageBubbleProps {
  message: any;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content || "");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
          if (payload.new.content !== message.content) {
            setEditedContent(payload.new.content);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [message.id]);

  useEffect(() => {
    setEditedContent(message.content || "");
  }, [message.content]);

  const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
  const canEditDelete = messageAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
      const { error } = await supabase
        .from('direct_messages')
        .update({ 
          content: editedContent,
          original_content: message.original_content || message.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', message.id);

      if (error) throw error;

      setIsEditing(false);
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

  const renderMessageContent = () => {
    if (isEditing) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 p-4 rounded-xl bg-luxury-darker/90 backdrop-blur-md border border-luxury-primary/10 shadow-lg min-w-[280px] max-w-[400px]"
        >
          <Input
            ref={inputRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEdit();
              }
              if (e.key === 'Escape') {
                setIsEditing(false);
              }
            }}
            className="w-full bg-luxury-darker/50 border-none focus:ring-1 focus:ring-luxury-primary/50 rounded-lg px-4 py-2"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsEditing(false)}
              className="text-luxury-neutral hover:text-white rounded-lg px-4"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleEdit} 
              className="bg-luxury-primary hover:bg-luxury-primary/90 rounded-lg px-4"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </motion.div>
      );
    }

    switch (message.message_type) {
      case 'video':
        return (
          <VideoMessage
            messageId={message.id}
            videoUrl={message.video_url}
            isViewed={!!message.viewed_at}
            onView={() => {}}
          />
        );
      case 'image':
        return message.media_url?.map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt="Image message"
            className="max-w-[200px] rounded-lg cursor-pointer"
            onClick={() => setSelectedMedia(url)}
          />
        ));
      case 'snap':
        return (
          <div 
            className="cursor-pointer bg-luxury-primary/10 p-3 rounded-lg"
            onClick={handleSnapView}
          >
            <Camera className="w-6 h-6 text-luxury-primary" />
            <div className="text-sm mt-1 text-luxury-neutral/70">
              {message.viewed_at ? "Snap opened" : "Tap to view snap"}
            </div>
          </div>
        );
      default:
        return (
          <p className={cn(
            "text-sm whitespace-pre-wrap",
            isOwnMessage ? "text-white" : "text-luxury-neutral"
          )}>
            {message.content}
          </p>
        );
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
            {renderMessageContent()}
          </motion.div>
          
          <div className={`flex items-center space-x-1 mt-1 text-[10px] text-luxury-neutral/50
            ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <span>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
              {message.content !== message.original_content && (
                <span className="ml-1 text-luxury-primary/70">(edited)</span>
              )}
            </span>
            {isOwnMessage && canEditDelete && message.message_type !== 'snap' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20">
                  {message.content && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="text-luxury-neutral hover:text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    </AnimatePresence>
  );
};
