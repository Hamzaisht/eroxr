
import { Play } from "lucide-react";
import { Message } from "./MessageBubbleContent";

interface SnapPreviewProps {
  message: Message;
  onSnapView?: () => Promise<void>;
}

export const SnapPreview = ({ message, onSnapView }: SnapPreviewProps) => {
  const isExpired = message.is_expired || (message.expires_at && new Date(message.expires_at) < new Date());
  const isAlreadyViewed = !!message.viewed_at;
  
  return (
    <div 
      className="cursor-pointer group"
      onClick={!isExpired && !isAlreadyViewed ? onSnapView : undefined}
    >
      <div className="bg-black relative w-48 h-32 rounded overflow-hidden">
        {isExpired ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-sm text-gray-400">Snap expired</p>
          </div>
        ) : isAlreadyViewed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <p className="text-sm text-gray-400">Snap viewed</p>
          </div>
        ) : (
          <>
            {message.media_url && message.media_url.length > 0 ? (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-center justify-center">
                <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm group-hover:bg-white/30 transition-all">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-sm text-gray-400">No preview available</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-1 text-xs text-center text-gray-400">
        {isExpired ? 
          "This snap has expired" : 
          isAlreadyViewed ? 
          "This snap has been viewed" : 
          "Tap to view snap (will expire after viewing)"}
      </div>
    </div>
  );
};
