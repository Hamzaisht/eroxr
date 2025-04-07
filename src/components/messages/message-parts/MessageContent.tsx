
import { VideoMessage } from "../VideoMessage";
import { Camera, FileText, Mic, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectMessage } from "@/integrations/supabase/types/message";
import { ProtectedMedia } from "@/components/security/ProtectedMedia";

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
  // Helper function to render media with protection
  const renderMedia = (url: string, type: 'image' | 'video') => (
    <ProtectedMedia
      contentOwnerId={message.sender_id || ''}
      className="max-w-full"
    >
      {type === 'image' ? (
        <img
          src={url}
          alt="Image message"
          className="max-w-[200px] rounded-lg cursor-pointer"
          onClick={() => !isEditing && onMediaSelect(url)}
        />
      ) : (
        <video
          src={url}
          className="max-w-[200px] rounded-lg cursor-pointer"
          onClick={() => !isEditing && onMediaSelect(url)}
        />
      )}
    </ProtectedMedia>
  );

  switch (message.message_type) {
    case 'video':
      return (
        <VideoMessage
          messageId={message.id || ''}
          videoUrl={message.video_url || message.media_url?.[0] || ''}
          isViewed={!!message.viewed_at}
          onView={() => {}}
        />
      );
    case 'image':
      return message.media_url?.map((url: string, index: number) => (
        <div key={index} className="media-container">
          {renderMedia(url, 'image')}
        </div>
      ));
    case 'audio':
      return (
        <div className="flex items-center p-2 bg-luxury-primary/10 rounded-lg">
          <Mic className="h-5 w-5 mr-2 text-luxury-primary" />
          <audio 
            src={message.media_url?.[0] || ''} 
            controls 
            className="max-w-[200px]"
          />
        </div>
      );
    case 'file':
      return (
        <div 
          className="flex items-center p-3 bg-luxury-primary/5 rounded-lg cursor-pointer"
          onClick={() => !isEditing && message.media_url?.[0] && onMediaSelect(message.media_url[0])}
        >
          <FileText className="h-6 w-6 text-luxury-primary mr-2" />
          <div>
            <div className="text-sm font-medium">{message.content || 'File'}</div>
            <div className="text-xs text-luxury-neutral/60">Click to view</div>
          </div>
        </div>
      );
    case 'snap':
      return (
        <div 
          className={cn(
            "cursor-pointer rounded-lg p-3 flex items-center",
            message.viewed_at ? "bg-gray-500/10" : "bg-luxury-primary/10"
          )}
          onClick={onSnapView}
        >
          <Camera className={cn(
            "w-6 h-6 mr-2",
            message.viewed_at ? "text-gray-500" : "text-luxury-primary"
          )} />
          <div className="text-sm">
            {message.viewed_at ? "Snap opened" : "Tap to view snap"}
          </div>
        </div>
      );
    case 'call':
      return (
        <div className="flex items-center p-2 bg-luxury-primary/5 rounded-lg">
          {message.call_type === 'video' ? (
            <Video className="h-5 w-5 mr-2 text-luxury-primary" />
          ) : (
            <Phone className="h-5 w-5 mr-2 text-luxury-primary" />
          )}
          <span className="text-sm">
            {message.call_status === 'answered'
              ? `${message.call_type === 'video' ? 'Video' : 'Audio'} call (${message.call_duration ? formatCallDuration(message.call_duration) : 'N/A'})`
              : `${message.call_status === 'missed' ? 'Missed' : 'Declined'} ${message.call_type === 'video' ? 'video' : 'audio'} call`}
          </span>
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

// Helper function to format call duration in mm:ss
function formatCallDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
