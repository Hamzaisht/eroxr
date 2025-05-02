
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { Button } from "@/components/ui/button";
import { Clock, Lock, Image, Video } from "lucide-react";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { cn } from "@/lib/utils";
import { MediaType } from "@/utils/media/types";

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
  // Handle text content
  if (message.content) {
    return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
  }

  // Handle Snap messages
  if (message.message_type === 'snap') {
    return (
      <div className="flex flex-col">
        <Button
          variant="secondary"
          className={cn(
            "py-6 w-full gap-2",
            isOwnMessage 
              ? "bg-luxury-primary/30 hover:bg-luxury-primary/40 text-white" 
              : "bg-luxury-neutral/10 hover:bg-luxury-neutral/20"
          )}
          onClick={onSnapView}
        >
          <Image className="h-5 w-5 mr-2" />
          {message.viewed_at 
            ? <span>Snap viewed</span> 
            : <span>View Snap</span>
          }
          {message.expires_at && (
            <Clock className="h-4 w-4 ml-1" />
          )}
        </Button>
        {message.viewed_at && (
          <p className="text-xs text-center mt-1 text-luxury-neutral/60">
            This snap has been viewed
          </p>
        )}
      </div>
    );
  }

  // Handle Media messages (image array)
  if (message.media_url && message.media_url.length > 0) {
    return (
      <div className="space-y-2">
        {message.media_url.map((url, index) => (
          <div 
            key={`${message.id}-image-${index}`}
            className="cursor-pointer rounded-md overflow-hidden"
            onClick={() => onMediaSelect(url)}
          >
            <UniversalMedia 
              item={{
                media_url: url,
                creator_id: message.sender_id,
                media_type: "image" as MediaType
              }}
              className="w-full max-h-60 object-cover"
              showWatermark={false}
              controls={false}
              muted={true}
            />
          </div>
        ))}
        {message.content && (
          <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    );
  }

  // Handle Video messages
  if (message.video_url) {
    return (
      <div className="space-y-2">
        <div 
          className="cursor-pointer rounded-md overflow-hidden"
          onClick={() => onMediaSelect(message.video_url!)}
        >
          <UniversalMedia 
            item={{
              video_url: message.video_url,
              creator_id: message.sender_id,
              media_type: "video" as MediaType
            }}
            className="w-full max-h-60 object-cover"
            showWatermark={false}
            controls={true}
            muted={true}
          />
        </div>
        {message.content && (
          <p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    );
  }

  // Fallback for empty content
  return (
    <div className="text-luxury-neutral/50 italic flex items-center justify-center gap-2">
      <Lock className="h-3 w-3" />
      <span className="text-sm">Encrypted message</span>
    </div>
  );
};
