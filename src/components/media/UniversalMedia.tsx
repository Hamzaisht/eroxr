
import { forwardRef, useState, useEffect, useMemo, Ref } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { useMediaService } from '@/hooks/useMediaService';
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface UniversalMediaProps {
  item: MediaSource | string | null;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  maxRetries?: number;
}

export const UniversalMedia = forwardRef(({
  item,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  showWatermark = false,
  objectFit = 'cover',
  alt = "Media content",
  onClick,
  onLoad,
  onError,
  onEnded,
  onTimeUpdate,
  maxRetries = 2
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Debug log the incoming item
  console.log("UniversalMedia rendering with item:", item);

  // Use our media service to handle all media processing
  const media = useMediaService(item, {
    maxRetries,
    onError: () => {
      if (onError) onError();
    },
    onLoad: () => {
      if (onLoad) onLoad();
    }
  });

  console.log("Media service processed:", { 
    url: media.url, 
    mediaType: media.mediaType, 
    hasError: media.hasError, 
    isLoading: media.isLoading 
  });

  // Handle retry attempts
  const handleRetry = () => {
    setLoadAttempt(prev => prev + 1);
    media.retry();
  };

  // Handle time updates for videos
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  };

  // Loading state
  if (media.isLoading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-black/20">
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
      </div>
    );
  }

  // Error state
  if (media.hasError) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/20 p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-500 mb-3 text-center">
          {media.errorMessage || 'Failed to load media'}
        </p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 hover:bg-primary text-white text-sm rounded-md"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  // Video rendering
  if (media.mediaType === MediaType.VIDEO) {
    console.log("Rendering VIDEO with URL:", media.url);
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={media.url || undefined}
          className={className}
          style={{ objectFit }}
          poster={poster || media.thumbnailUrl || undefined}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          playsInline
          onClick={onClick}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          key={`video-${loadAttempt}`} // Key to force re-render on retry
          crossOrigin="anonymous"
          onError={(e) => {
            console.error("Video error:", e, "URL:", media.url);
            media.handleError();
          }}
          onLoadedData={() => {
            console.log("Video loaded successfully:", media.url);
            media.handleLoad();
          }}
        />
        
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
            eroxr
          </div>
        )}
      </div>
    );
  }
  
  // Image rendering
  console.log("Rendering IMAGE with URL:", media.url);
  return (
    <div className="relative w-full h-full">
      <img
        ref={ref as React.RefObject<HTMLImageElement>}
        src={media.url || undefined}
        className={className}
        style={{ objectFit }}
        alt={alt}
        onClick={onClick}
        key={`image-${loadAttempt}`} // Key to force re-render on retry
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("Image error:", e, "URL:", media.url);
          media.handleError();
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", media.url);
          media.handleLoad();
        }}
      />
      
      {showWatermark && (
        <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
          eroxr
        </div>
      )}
    </div>
  );
});

UniversalMedia.displayName = 'UniversalMedia';
