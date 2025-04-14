
import { useState, useEffect, useRef } from "react";
import { MediaLoading } from "./MediaLoading";
import { MediaError } from "./MediaError";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "./MediaImage";
import { isVideoUrl } from "@/utils/media/mediaTypeUtils";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";

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
  const processedUrlRef = useRef<string | null>(null);

  // Process media source only once on mount or when item changes
  useEffect(() => {
    const processMediaSource = () => {
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

        // Only process the URL once and store the result
        const processedUrl = getPlayableMediaUrl(url);
        processedUrlRef.current = processedUrl;
        setMediaUrl(processedUrl);
        
        // Determine if it's a video by URL pattern
        setIsVideoType(isVideoUrl(url) || 
          (typeof item === 'object' && 
            (item.media_type === 'video' || item.content_type === 'video')));
        
      } catch (error) {
        console.error("Error processing media:", error);
        setHasError(true);
        if (onError) onError();
      } finally {
        setIsLoading(false);
      }
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
    console.error("Media loading error for:", mediaUrl);
    setHasError(true);
    setIsLoading(false);
    if (onError) onError();
  };

  // Handle retry with counter to prevent infinite loops
  const handleRetry = () => {
    if (retryCount < 2) {
      console.log("Retrying media load, attempt:", retryCount + 1);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      console.error("Max retry attempts reached for media:", mediaUrl);
    }
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
          onRetry={retryCount < 2 ? handleRetry : undefined}
          message={retryCount >= 2 ? "Failed to load media after multiple attempts" : "Failed to load media"}
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
