
import { useState, forwardRef, useMemo } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useMedia } from "@/hooks/useMedia";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { MediaType } from "@/utils/media/mediaUtils";
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
    // Use our custom hook to handle media loading and errors
    const { 
      url, 
      isLoading, 
      isError, 
      mediaType, 
      retry, 
      retryCount 
    } = useMedia(item, { autoLoad: true, maxRetries: 2 });
    
    // Use video player hook for video-specific functionality
    const {
      videoRef,
      hasError: videoError,
    } = useVideoPlayer({
      url: mediaType === MediaType.VIDEO ? url : null,
      autoPlay,
      muted,
      loop,
      onError,
      onEnded,
      onLoadedData: onLoad
    });

    // Handle errors and loading states
    const handleRetry = () => {
      retry();
    };

    // Error states
    if (isError || videoError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="mb-4">Failed to load media</p>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      );
    }

    if (!url) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white">
          <p className="mb-4">Media not available</p>
        </div>
      );
    }

    // Loading state
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      );
    }

    // Render the appropriate media element
    if (mediaType === MediaType.VIDEO) {
      return (
        <video
          key={`${url}-${retryCount}`}
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          src={url}
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onTimeUpdate={onTimeUpdate}
          playsInline
        />
      );
    }

    // Image
    return (
      <img
        key={`${url}-${retryCount}`}
        ref={ref as React.RefObject<HTMLImageElement>}
        src={url}
        className={className}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
        alt="Media content"
      />
    );
  }
));

UniversalMedia.displayName = "UniversalMedia";
