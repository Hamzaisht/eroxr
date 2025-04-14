
import { useState, useEffect } from "react";
import { MediaLoadingState } from "@/components/media/states/MediaLoadingState";
import { MediaErrorState } from "@/components/media/states/MediaErrorState";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "@/components/media/MediaImage";
import { getPlayableMediaUrl, isVideoContent } from "@/utils/media/getPlayableMediaUrl";
import { debugMediaUrl, getMediaErrorInfo } from "@/utils/media/debugMediaUtils";

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
  onLoadedData?: () => void;
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
  onLoadedData,
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

  // Process media source to get proper URL and determine media type
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Handle direct string URL
      if (typeof item === 'string') {
        const url = getPlayableMediaUrl(item);
        setMediaUrl(url);
        setIsVideoType(isVideoContent(item));
        return;
      }
      
      if (!item) {
        console.error("No media item provided");
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      // Get playable URL from the item
      const url = getPlayableMediaUrl(item);
      
      // If no URL found, show error
      if (!url) {
        console.error("No valid media URL found in item:", item);
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      setMediaUrl(url);
      
      // Determine if this is video content
      setIsVideoType(isVideoContent(item));
      
      // Log the URL for debugging
      console.log(`Media URL (${isVideoType ? 'video' : 'image'}):`, url);
    } catch (error) {
      console.error("Error processing media item:", error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [item, retryCount]);

  // Handle media load success
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  // Handle media load error
  const handleError = () => {
    console.error("Media failed to load:", mediaUrl);
    
    if (mediaUrl) {
      debugMediaUrl(mediaUrl);
      
      // Log detailed error info
      const errorInfo = getMediaErrorInfo(mediaUrl);
      console.error(errorInfo);
    }
    
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  // Handle retry after error
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  if (!mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-black/80 ${className}`}>
        <p className="text-white/70 py-8">Media unavailable</p>
      </div>
    );
  }

  // Extract creator ID from item if it's an object
  const creatorId = typeof item === 'object' ? item.creator_id : undefined;
  
  // Extract alt text from item if it's an object
  const altText = typeof item === 'object' ? (item.alt_text || "Media content") : "Media content";

  // Extract poster URL for videos if available
  const posterUrl = typeof item === 'object' ? item.poster_url : undefined;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <MediaLoadingState />}
      
      {hasError && (
        <MediaErrorState 
          onRetry={handleRetry}
          accessibleUrl={mediaUrl}
          retryCount={retryCount}
        />
      )}
      
      {isVideoType ? (
        <VideoPlayer
          url={mediaUrl}
          poster={posterUrl}
          autoPlay={autoPlay}
          className="w-full h-full"
          onError={handleError}
          onEnded={onEnded}
          onLoadedData={() => {
            handleLoad();
            if (onLoadedData) onLoadedData();
          }}
          creatorId={creatorId}
          controls={controls}
          onClick={onClick}
        />
      ) : (
        <MediaImage
          url={mediaUrl}
          alt={altText}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          showWatermark={showWatermark}
          creatorId={creatorId}
          onClick={onClick}
        />
      )}
    </div>
  );
};
