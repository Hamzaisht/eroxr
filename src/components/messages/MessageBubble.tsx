import { VideoMessage } from "./VideoMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { MediaViewer } from "../media/MediaViewer";
import { useState } from "react";

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

  const renderMessageContent = () => {
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
          <div className="italic text-sm">
            {message.viewed_at ? "Ero snap opened" : "Ero snap sent"}
          </div>
        );
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <>
      <div className={`flex items-end space-x-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`group max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
          <div
            className={`
              rounded-2xl px-4 py-2 
              ${isOwnMessage 
                ? "bg-luxury-primary text-white" 
                : "bg-luxury-neutral/5 text-luxury-neutral"
              }
            `}
          >
            {renderMessageContent()}
          </div>
          
          <div className={`flex items-center space-x-1 mt-1 text-xs text-luxury-neutral/50
            ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <span>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
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