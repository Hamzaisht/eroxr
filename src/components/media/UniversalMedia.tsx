
import { useState, useEffect } from "react";
import { MediaLoading } from "./MediaLoading";
import { MediaError } from "./MediaError";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "./MediaImage";
import { isVideoUrl } from "@/utils/media/mediaTypeUtils";
import { addCacheBuster, checkUrlContentType } from "@/utils/media/urlUtils";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";

export interface MediaItem {
  media_url?: string | string[] | null;
  video_url?: string | null;
  video_urls?: string[] | null;
  url?: string | null;
  media_type?: string;
  content_type?: string;
  creator_id?: string;
  alt_text?: string;
  poster_url?: string | null;
}

interface UniversalMediaProps {
  item: MediaItem | string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
  showWatermark?: boolean;
  onClick?: () => void;
}

export const UniversalMedia = ({
  item,
  className = "",
  onError,
  onLoad,
  onEnded,
  autoPlay = false,
  controls = true,
  showWatermark = false,
  onClick
}: UniversalMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVideoType, setIsVideoType] = useState(false);

  // Process media source
  useEffect(() => {
    const processMediaSource = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        // Handle direct string URL
        let url = typeof item === 'string' ? item : '';
        
        // Extract URL from object
        if (typeof item === 'object' && item !== null) {
          url = item.video_url || 
                (Array.isArray(item.video_urls) ? item.video_urls[0] : '') ||
                (typeof item.media_url === 'string' ? item.media_url : '') ||
                (Array.isArray(item.media_url) ? item.media_url[0] : '') ||
                item.url || '';
        }
        
        if (!url) {
          throw new Error("No valid media URL found");
        }

        // Add cache buster and check content type
        const processedUrl = addCacheBuster(url);
        const { isValid, contentType } = await checkUrlContentType(processedUrl);
        
        if (!isValid) {
          throw new Error("Invalid media URL");
        }
        
        setMediaUrl(processedUrl);
        setIsVideoType(isVideoUrl(url) || contentType?.startsWith('video/') || false);
        
      } catch (error) {
        console.error("Error processing media:", error);
        setHasError(true);
        if (onError) onError();
      }
      
      setIsLoading(false);
    };

    processMediaSource();
  }, [item, retryCount]);

  // Handle load success
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  // Handle media error
  const handleError = () => {
    if (mediaUrl) {
      debugMediaUrl(mediaUrl);
    }
    
    setHasError(true);
    setIsLoading(false);
    if (onError) onError();
  };

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
  };

  if (!mediaUrl) {
    return (
      <MediaError 
        message="Media unavailable" 
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <MediaLoading />}
      
      {hasError && (
        <MediaError 
          onRetry={retryCount < 3 ? handleRetry : undefined}
          message={retryCount >= 3 ? "Failed to load media after multiple attempts" : "Failed to load media"}
        />
      )}
      
      {!hasError && !isLoading && (
        isVideoType ? (
          <VideoPlayer
            url={mediaUrl}
            poster={typeof item === 'object' ? item.poster_url : undefined}
            autoPlay={autoPlay}
            onError={handleError}
            onEnded={onEnded}
            controls={controls}
            onClick={onClick}
          />
        ) : (
          <MediaImage
            url={mediaUrl}
            alt={typeof item === 'object' ? item.alt_text || "Media content" : "Media content"}
            onLoad={handleLoad}
            onError={handleError}
            onClick={onClick}
          />
        )
      )}
    </div>
  );
};
