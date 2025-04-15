
import { useState, useEffect, forwardRef, useMemo, useCallback } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { getPlayableMediaUrl } from '@/utils/media/mediaUtils';
import { memo } from "react";

interface MediaItem {
  media_url?: string | null | string[];
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

export const UniversalMedia = memo(forwardRef<HTMLVideoElement | HTMLImageElement, UniversalMediaProps>(
  ({
    item,
    className = "",
    autoPlay = false,
    controls = true,
    muted = true,
    loop = false,
    poster,
    onClick,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate
  }, ref) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    // Process media URL - memoized to prevent recalculations
    const { url, isVideo } = useMemo(() => {
      try {
        // Handle direct string input
        if (typeof item === 'string') {
          return { 
            url: item, 
            isVideo: item.includes('.mp4') || item.includes('.webm') || item.includes('.mov')
          };
        }
        
        if (!item) {
          return { url: null, isVideo: false };
        }
        
        // Determine if this is a video
        const isMediaVideo = item.media_type === 'video' || 
                             item.content_type === 'video' || 
                             !!item.video_url;
        
        // Get the appropriate URL
        let mediaUrl: string | null = null;
        
        if (isMediaVideo && item.video_url) {
          mediaUrl = item.video_url;
        } else if (item.media_url) {
          if (typeof item.media_url === 'string') {
            mediaUrl = item.media_url;
          } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
            mediaUrl = item.media_url[0];
          }
        }
        
        return { 
          url: mediaUrl, 
          isVideo: isMediaVideo 
        };
      } catch (error) {
        console.error("Error processing media item:", error);
        return { url: null, isVideo: false };
      }
    }, [item]);

    // Reset state when URL changes
    useEffect(() => {
      setIsLoading(true);
      setError(null);
    }, [url]);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
      setError(null);
      if (onLoad) onLoad();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setError(`Failed to load ${isVideo ? 'video' : 'image'}`);
      if (onError) onError();
    }, [isVideo, onError]);

    const handleRetry = useCallback(() => {
      setIsLoading(true);
      setError(null);
      setRetryCount(prev => prev + 1);
    }, []);

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
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-white mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}
          
          <video
            key={`${url}-${retryCount}`}
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
        </>
      );
    }

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}
        
        <img
          key={`${url}-${retryCount}`}
          ref={ref as React.RefObject<HTMLImageElement>}
          src={url}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          alt="Media content"
        />
      </>
    );
  }
));

UniversalMedia.displayName = "UniversalMedia";
