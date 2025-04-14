
import { useState, useEffect } from "react";
import { MediaLoadingState } from "@/components/media/states/MediaLoadingState";
import { MediaErrorState } from "@/components/media/states/MediaErrorState";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "@/components/media/MediaImage";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { isVideo } from "@/utils/media/mediaTypeUtils";

interface UniversalMediaProps {
  item: any;
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
  const [isVideoContent, setIsVideoContent] = useState(false);

  // Process media source to get proper URL and determine media type
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Get playable media URL from the item
      const url = getPlayableMediaUrl(item);
      setMediaUrl(url);
      
      // Determine if it's a video
      const videoCheck = isVideo(item) || 
        (typeof item === 'object' && 
         (item?.media_type === 'video' || 
          item?.content_type === 'video' || 
          item?.video_url));
          
      setIsVideoContent(videoCheck);
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
    console.error("Media failed to load:", item);
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

  // Handle custom click
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  // If no media URL, show empty state
  if (!mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker/80 ${className}`}>
        <p className="text-luxury-neutral py-8">Media unavailable</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {isLoading && <MediaLoadingState />}
      
      {hasError && (
        <MediaErrorState 
          onRetry={handleRetry}
          accessibleUrl={mediaUrl}
          retryCount={retryCount}
        />
      )}
      
      {isVideoContent ? (
        <VideoPlayer
          url={mediaUrl}
          autoPlay={autoPlay}
          className="w-full h-full"
          onError={handleError}
          onEnded={onEnded}
          onLoadedData={() => {
            handleLoad();
            if (onLoadedData) onLoadedData();
          }}
          creatorId={item?.creator_id}
          controls={controls}
          onClick={onClick}
        />
      ) : (
        <MediaImage
          url={mediaUrl}
          alt={item?.alt_text || "Media content"}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          showWatermark={showWatermark}
          creatorId={item?.creator_id}
          onClick={onClick}
        />
      )}
    </div>
  );
};
