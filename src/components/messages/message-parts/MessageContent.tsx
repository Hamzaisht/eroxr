
import { VideoMessage } from "../VideoMessage";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectMessage } from "@/integrations/supabase/types/message";

interface MessageContentProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  isEditing: boolean;
  onMediaSelect: (url: string) => void;
  onSnapView: () => void;
}

export const MessageContent = ({ 
  message, 
  isOwnMessage, 
  isEditing,
  onMediaSelect,
  onSnapView 
}: MessageContentProps) => {
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
          onClick={() => !isEditing && onMediaSelect(url)}
        />
      ));
    case 'snap':
      return (
        <div 
          className="cursor-pointer bg-luxury-primary/10 p-3 rounded-lg"
          onClick={onSnapView}
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
