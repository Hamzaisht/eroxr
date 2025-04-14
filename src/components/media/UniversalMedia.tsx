
import { useEffect, useState, forwardRef } from "react";
import { getPlayableMediaUrl } from "@/utils/media/mediaUtils";

// MediaItem type to provide better TypeScript support
interface MediaItem {
  media_url?: string | string[];
  video_url?: string;
  video_urls?: string[];
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

    useEffect(() => {
      const getMediaUrl = () => {
        try {
          const mediaUrl = getPlayableMediaUrl(item);
          setUrl(mediaUrl);

          // Determine if this is a video
          if (typeof item === 'object') {
            setIsVideo(
              item?.media_type === 'video' || 
              item?.content_type === 'video' ||
              !!item?.video_url ||
              (Array.isArray(item?.video_urls) && item.video_urls.length > 0)
            );
          } else if (typeof item === 'string' && mediaUrl) {
            // Check URL for video file extensions
            const lowerUrl = mediaUrl.toLowerCase();
            setIsVideo(
              lowerUrl.includes('.mp4') || 
              lowerUrl.includes('.webm') || 
              lowerUrl.includes('.mov') || 
              lowerUrl.includes('/video/')
            );
          }
        } catch (error) {
          console.error("Error getting media URL:", error);
          if (onError) onError();
        }
      };

      getMediaUrl();
    }, [item]);

    const handleLoad = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    const handleError = () => {
      console.error(`Media load error for URL: ${url}`);
      if (onError) onError();
    };

    // If no URL, don't render anything
    if (!url) return null;

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
