
import { VideoMessage } from "./VideoMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck, MoreVertical, Camera, Trash2, Edit, X } from "lucide-react";
import { MediaViewer } from "../media/MediaViewer";
import { useState, useRef } from "react";
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

  const messageAge = new Date().getTime() - new Date(message.created_at).getTime();
  const canEditDelete = messageAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      toast({
        description: "Message deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete message",
      });
    }
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) return;
    
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ content: editedContent })
        .eq('id', message.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        description: "Message updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update message",
      });
    }
  };

  const handleSnapView = () => {
    if (!message.media_url?.[0]) return;
    setSelectedMedia(message.media_url[0]);

    // Mark message as viewed if it's a snap
    if (message.message_type === 'snap' && !message.viewed_at) {
      supabase
        .from('direct_messages')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', message.id)
        .then(() => {
          // After viewing, the message will be deleted after a short delay
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
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-w-[200px]"
            autoFocus
          />
          <Button size="sm" onClick={handleEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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
    <>
      <div className={`flex items-end space-x-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
        {!isOwnMessage && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`group max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
          <div
            className={cn(
              "rounded-2xl px-3 py-2",
              isOwnMessage 
                ? "bg-[#0B84FF] text-white" 
                : "bg-[#E9E9EB] dark:bg-luxury-neutral/5"
            )}
          >
            {renderMessageContent()}
          </div>
          
          <div className={`flex items-center space-x-1 mt-0.5 text-[10px] text-luxury-neutral/50
            ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <span>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
            {isOwnMessage && canEditDelete && message.message_type !== 'snap' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {message.content && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete}>
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
      </div>

      <MediaViewer
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
};
