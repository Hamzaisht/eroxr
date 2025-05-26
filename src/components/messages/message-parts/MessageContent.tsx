
import React, { useState, useCallback } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Message } from "@/integrations/supabase/types/messages";
import { OptimizedUniversalMedia } from "@/components/media/OptimizedUniversalMedia";
import { MediaType } from "@/types/media";
import { AlertCircle, RefreshCw } from "lucide-react";

interface MessageContentProps {
  message: Message;
  isCurrentUser: boolean;
  onMediaClick?: (url: string) => void;
}

export const MessageContent = ({ message, isCurrentUser, onMediaClick }: MessageContentProps) => {
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});
  const [retries, setRetries] = useState<Record<string, number>>({});

  const handleImageLoad = useCallback((url: string) => {
    setLoadErrors(prev => ({ ...prev, [url]: false }));
  }, []);

  const handleImageError = useCallback((url: string) => {
    console.error(`Image load error: ${url}`);
    setLoadErrors(prev => ({ ...prev, [url]: true }));
    
    // Track retry count
    const currentRetries = retries[url] || 0;
    const newRetryCount = currentRetries + 1;
    setRetries(prev => ({ ...prev, [url]: newRetryCount }));
  }, [retries]);

  const handleRetry = (url: string) => {
    setLoadErrors(prev => ({ ...prev, [url]: false }));
  };

  // Generic media error handler
  const onError = (url: string) => {
    console.error("Media error for:", url);
    
    // Track retry count for this URL
    const currentRetries = retries[url] || 0;
    const newRetryCount = currentRetries + 1;
    setRetries(prev => ({ ...prev, [url]: newRetryCount }));
  };

  // Render image attachments
  const renderImages = () => {
    const hasImages = message.image_urls && message.image_urls.length > 0;
    if (!hasImages) return null;

    return message.image_urls?.map((url, index) => (
      <div key={`img-${index}`} className="relative">
        {loadErrors[url] ? (
          <div className="relative w-full h-full flex items-center justify-center bg-luxury-darker rounded-lg">
            <div className="flex flex-col items-center justify-center text-luxury-neutral/70 p-8">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="mb-3">Failed to load image</p>
              <button 
                onClick={() => handleRetry(url)}
                className="flex items-center gap-2 px-3 py-1.5 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
              >
                <RefreshCw className="h-4 w-4" /> 
                Retry
              </button>
            </div>
          </div>
        ) : (
          <OptimizedUniversalMedia
            item={{
              url: url,
              type: MediaType.IMAGE,
              media_url: url,
              creator_id: message.sender_id || undefined
            }}
            className="w-full max-h-60 object-cover"
            onClick={() => onMediaClick?.(url)}
            onLoad={() => handleImageLoad(url)}
            onError={() => handleImageError(url)}
            maxRetries={2}
            compact={true}
          />
        )}
      </div>
    ));
  };

  // Render video attachments
  const renderVideos = () => {
    const hasVideos = message.video_urls && message.video_urls.length > 0;
    if (!hasVideos) return null;

    return message.video_urls?.map((url, index) => (
      <div key={`vid-${index}`} className="relative">
        <OptimizedUniversalMedia
          item={{
            url: url,
            type: MediaType.VIDEO,
            media_url: url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full max-h-60 object-cover"
          onError={() => onError(url)}
          maxRetries={2}
          compact={true}
        />
      </div>
    ));
  };

  // Render audio attachments
  const renderAudios = () => {
    const hasAudios = message.audio_urls && message.audio_urls.length > 0;
    if (!hasAudios) return null;

    return message.audio_urls?.map((url, index) => (
      <div key={`aud-${index}`} className="relative">
        <OptimizedUniversalMedia
          item={{
            url: url,
            type: MediaType.AUDIO,
            media_url: url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full"
          controls={true}
          onError={() => onError(url)}
          maxRetries={2}
          compact={true}
        />
      </div>
    ));
  };

  // Video message
  if (message.video_url) {
    return (
      <div className="w-full overflow-hidden rounded-lg">
        <OptimizedUniversalMedia
          item={{
            url: message.video_url,
            type: MediaType.VIDEO, 
            media_url: message.video_url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full max-h-60 object-cover"
          onError={() => onError(message.video_url)}
          maxRetries={2}
          compact={true}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {message.text && (
        <p className="text-sm text-gray-100 break-words">{message.text}</p>
      )}
      {renderImages()}
      {renderVideos()}
      {renderAudios()}
    </div>
  );
};
