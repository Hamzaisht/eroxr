
import React from 'react';
import { Message } from "@/integrations/supabase/types/messages";
import { SimpleMediaDisplay } from "@/components/media/SimpleMediaDisplay";

interface MessageContentProps {
  message: Message;
  isCurrentUser: boolean;
  onMediaClick?: (url: string) => void;
}

export const MessageContent = ({ message, isCurrentUser, onMediaClick }: MessageContentProps) => {
  return (
    <div className="flex flex-col w-full">
      {message.text && (
        <p className="text-sm text-gray-100 break-words">{message.text}</p>
      )}
      
      {/* Simple image display */}
      {message.image_urls && message.image_urls.length > 0 && (
        <div className="mt-2 space-y-2">
          {message.image_urls.map((url, index) => (
            <div key={index} className="relative">
              <SimpleMediaDisplay
                url={url}
                className="w-full max-h-60 object-cover rounded cursor-pointer"
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Simple video display */}
      {message.video_urls && message.video_urls.length > 0 && (
        <div className="mt-2 space-y-2">
          {message.video_urls.map((url, index) => (
            <div key={index} className="relative">
              <SimpleMediaDisplay
                url={url}
                className="w-full max-h-60 rounded"
                alt={`Video ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Single video message */}
      {message.video_url && (
        <div className="mt-2">
          <SimpleMediaDisplay
            url={message.video_url}
            className="w-full max-h-60 rounded"
            alt="Video message"
          />
        </div>
      )}
    </div>
  );
};
