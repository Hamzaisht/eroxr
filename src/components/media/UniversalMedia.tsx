
import { useEffect, useState, forwardRef } from "react";

// MediaItem type to provide better TypeScript support
interface MediaItem {
  media_url?: string | null | string[];  // Updated to explicitly allow string array
  video_url?: string | null;
  creator_id?: string;
  media_type?: string;
  content_type?: string;
  [key: string]: any;
}

interface UniversalMediaProps {
  item: MediaItem | string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

export const UniversalMedia = forwardRef<HTMLVideoElement | HTMLImageElement, UniversalMediaProps>(
  ({
    item,
    className = "",
    autoPlay = false,
    controls = true,
    muted = true,
    loop = false,
    poster,
    showWatermark = false,
    onClick,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate
  }, ref) => {
    const [url, setUrl] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
      const getMediaUrl = () => {
        try {
          // Handle when item is a string
          if (typeof item === 'string') {
            setUrl(item);
            setIsVideo(item.includes('.mp4') || item.includes('.webm') || item.includes('.mov'));
            return;
          }
          
          // Handle when item is an object
          if (!item) {
            console.error("No media item provided");
            return;
          }
          
          // Determine if this is a video
          const isMediaVideo = 
            item.media_type === 'video' || 
            item.content_type === 'video' || 
            !!item.video_url;
          
          setIsVideo(isMediaVideo);
          
          // Get the appropriate URL
          let mediaUrl: string | null = null;
          
          if (isMediaVideo && item.video_url) {
            mediaUrl = item.video_url;
          } else if (!isMediaVideo && item.media_url) {
            // Fix for TypeScript error - properly handle different types of media_url
            if (typeof item.media_url === 'string') {
              mediaUrl = item.media_url;
            } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
              mediaUrl = item.media_url[0];
            }
          }
          
          // Add cache busting parameter to prevent caching issues
          if (mediaUrl) {
            const cacheBuster = `${mediaUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
            mediaUrl = `${mediaUrl}${cacheBuster}`;
            console.log(`Using media URL: ${mediaUrl}`);
          }
          
          setUrl(mediaUrl);
        } catch (error) {
          console.error("Error getting media URL:", error);
          if (onError) onError();
        }
      };

      getMediaUrl();
    }, [item, retryCount]);

    const handleLoad = () => {
      console.log("Media loaded successfully:", url);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    const handleError = () => {
      console.error(`Media load error for URL: ${url}`);
      if (onError) onError();
    };
    
    const handleRetry = () => {
      console.log("Retrying media load...");
      setRetryCount(prev => prev + 1);
    };

    // If no URL, render error with retry button
    if (!url) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white">
          <p className="mb-4">Failed to load media</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-luxury-primary rounded-md hover:bg-luxury-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={url}
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
          playsInline
        />
      );
    }

    return (
      <img
        ref={ref as React.RefObject<HTMLImageElement>}
        src={url}
        className={className}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        alt="Media content"
      />
    );
  }
);

UniversalMedia.displayName = "UniversalMedia";
