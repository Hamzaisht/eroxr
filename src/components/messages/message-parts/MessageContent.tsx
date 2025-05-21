
import React, { useState, useCallback } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Message } from "@/integrations/supabase/types/messages";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";
import { AlertCircle, RefreshCw } from "lucide-react";
import { reportMediaError } from "@/utils/media/mediaMonitoring";

interface MessageContentProps {
  message: Message;
  isCurrentUser: boolean;
  onMediaClick?: (url: string) => void;
}

export const MessageContent = ({ message, isCurrentUser, onMediaClick }: MessageContentProps) => {
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState<Record<string, number>>({});

  const handleImageLoad = useCallback((url: string) => {
    setLoadErrors(prev => ({ ...prev, [url]: false }));
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback((url: string) => {
    console.error(`Image load error: ${url}`);
    setLoadErrors(prev => ({ ...prev, [url]: true }));
    setIsLoading(false);
    
    // Track retry count
    const currentRetries = retries[url] || 0;
    const newRetryCount = currentRetries + 1;
    setRetries(prev => ({ ...prev, [url]: newRetryCount }));
    
    if (newRetryCount >= 2) {
      reportMediaError(
        url,
        'load_failure',
        newRetryCount,
        'image',
        'MessageContent'
      );
    }
  }, [retries]);

  const handleRetry = (url: string) => {
    setLoadErrors(prev => ({ ...prev, [url]: false }));
    setIsLoading(true);
  };

  // Generic media error handler
  const onError = (url: string) => {
    console.error("Media error for:", url);
    
    // Track retry count for this URL
    const currentRetries = retries[url] || 0;
    const newRetryCount = currentRetries + 1;
    setRetries(prev => ({ ...prev, [url]: newRetryCount }));
    
    if (newRetryCount >= 2) {
      const isVideo = url.match(/\.(mp4|webm|mov|avi)$/i) ? true : false;
      reportMediaError(
        url,
        'load_failure',
        newRetryCount,
        isVideo ? 'video' : 'image',
        'MessageContent'
      );
    }
  };

  // Render image attachments
  const renderImages = () => {
    const hasImages = message.image_urls && message.image_urls.length > 0;
    if (!hasImages) return null;

    return message.image_urls?.map((url, index) => (
      <div key={`img-${index}`} className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <p className="text-white">Loading...</p>
          </div>
        )}
        
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
          <UniversalMedia
            item={{
              url: url,
              type: MediaType.IMAGE,
              media_url: url,
              creator_id: message.sender_id || undefined
            }}
            className="w-full max-h-60 object-cover"
            showWatermark={false}
            onClick={() => onMediaClick?.(url)}
            onLoad={() => handleImageLoad(url)}
            onError={() => handleImageError(url)}
            maxRetries={2}
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
        <UniversalMedia
          item={{
            url: url,
            type: MediaType.VIDEO,
            media_url: url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full max-h-60 object-cover"
          showWatermark={false}
          onError={() => onError(url)}
          maxRetries={2}
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
        <UniversalMedia
          item={{
            url: url,
            type: MediaType.AUDIO,
            media_url: url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full"
          showWatermark={false}
          controls={true}
          onError={() => onError(url)}
          maxRetries={2}
        />
      </div>
    ));
  };

  // Video message
  if (message.video_url) {
    return (
      <div className="w-full overflow-hidden rounded-lg">
        <UniversalMedia
          item={{
            url: message.video_url,
            type: MediaType.VIDEO, 
            media_url: message.video_url,
            creator_id: message.sender_id || undefined
          }}
          className="w-full max-h-60 object-cover"
          showWatermark={false}
          onError={() => onError(message.video_url)}
          maxRetries={2}
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
