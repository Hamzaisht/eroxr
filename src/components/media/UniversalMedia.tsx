
import { useState, useEffect } from "react";
import { MediaLoadingState } from "@/components/media/states/MediaLoadingState";
import { MediaErrorState } from "@/components/media/states/MediaErrorState";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "@/components/media/MediaImage";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { isVideo } from "@/utils/media/mediaTypeUtils";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";

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
      // Get URL from the item
      let url: string | null = null;
      
      // Handle different property names
      if (typeof item === 'string') {
        url = item;
      } else if (item?.video_url) {
        url = item.video_url;
        setIsVideoContent(true);
      } else if (item?.media_url) {
        const mediaUrl = Array.isArray(item.media_url) 
          ? item.media_url[0] 
          : item.media_url;
        url = mediaUrl;
        setIsVideoContent(item?.media_type === 'video' || item?.content_type === 'video');
      } else if (item?.video_urls && Array.isArray(item.video_urls) && item.video_urls.length > 0) {
        url = item.video_urls[0];
        setIsVideoContent(true);
      } else if (item?.url) {
        url = item.url;
      }
      
      // If no URL found, show error
      if (!url) {
        console.error("No valid media URL found in item:", item);
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      // Process URL for display
      const processedUrl = getPlayableMediaUrl(url);
      setMediaUrl(processedUrl);
      
      // Log the URL for debugging
      console.log(`Media URL (${isVideoContent ? 'video' : 'image'}):`, processedUrl);
      
      // Auto-detect video content by URL if not already determined
      if (!isVideoContent && typeof url === 'string') {
        const urlLower = url.toLowerCase();
        if (urlLower.includes('.mp4') || 
            urlLower.includes('.webm') || 
            urlLower.includes('.mov') || 
            urlLower.includes('video')) {
          setIsVideoContent(true);
        }
      }
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
