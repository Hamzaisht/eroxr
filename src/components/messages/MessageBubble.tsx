import { VideoMessage } from "./VideoMessage";

interface MessageBubbleProps {
  message: any;
  isOwnMessage: boolean;
  currentUserId: string | undefined;
}

export const MessageBubble = ({ message, isOwnMessage, currentUserId }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.message_type === 'video' ? (
          <VideoMessage
            messageId={message.id}
            videoUrl={message.video_url}
            isViewed={!!message.viewed_at}
            onView={() => {}}
          />
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
      </div>
    </div>
  );
};