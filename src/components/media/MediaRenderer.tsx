
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { MediaLoadingState } from "./states/MediaLoadingState";
import { MediaErrorState } from "./states/MediaErrorState";
import { useMediaHandling } from "@/hooks/useMediaHandling";
import { MediaType } from "@/utils/media/types";

interface MediaRendererProps {
  src: string | null | undefined;
  type?: MediaType;
  fallbackSrc?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  alt?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  showLoadingState?: boolean;
  showErrorState?: boolean;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef<HTMLVideoElement | HTMLImageElement, MediaRendererProps>(({
  src,
  type = MediaType.UNKNOWN,
  fallbackSrc,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  alt = "Media content",
  objectFit = 'cover',
  onClick,
  onLoad,
  onError,
  onEnded,
  showLoadingState = true,
  showErrorState = true,
  allowRetry = true,
  maxRetries = 2
}, ref) => {
  const [isMediaVisible, setIsMediaVisible] = useState(false);
  
  const {
    currentSrc,
    status,
    handleLoad,
    handleError,
    retry,
    isLoading,
    hasError,
    retryCount
  } = useMediaHandling({
    src,
    fallbackSrc,
    onLoad: () => {
      setIsMediaVisible(true);
      if (onLoad) onLoad();
    },
    onError,
    maxRetries
  });

  // Determine media type if not provided
  const determineType = () => {
    if (type !== MediaType.UNKNOWN) return type;
    
    if (!currentSrc) return MediaType.UNKNOWN;
    
    const url = currentSrc.toLowerCase();
    if (url.match(/\.(mp4|webm|mov|m4v|avi)($|\?)/i)) return MediaType.VIDEO;
    if (url.match(/\.(jpe?g|png|gif|webp|avif|svg)($|\?)/i)) return MediaType.IMAGE;
    if (url.match(/\.(mp3|wav|ogg)($|\?)/i)) return MediaType.AUDIO;
    
    // If URL contains certain paths that suggest video
    if (url.includes('/videos/') || url.includes('/video/') || url.includes('stream')) {
      return MediaType.VIDEO;
    }
    
    return MediaType.IMAGE; // Default to image as fallback
  };
  
  const mediaType = determineType();

  if (!currentSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/10 rounded`}>
        <span className="text-muted-foreground text-sm">No media source</span>
      </div>
    );
  }

  // Show loading state
  if (isLoading && showLoadingState) {
    return <MediaLoadingState className={className} />;
  }

  // Show error state
  if (hasError && showErrorState) {
    return (
      <MediaErrorState 
        onRetry={allowRetry ? retry : undefined}
        accessibleUrl={currentSrc}
        retryCount={retryCount}
        message="Failed to load media content"
      />
    );
  }

  // Render based on media type
  if (mediaType === MediaType.VIDEO) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          ref={ref as React.Ref<HTMLVideoElement>}
          src={currentSrc}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isMediaVisible ? "opacity-100" : "opacity-0",
            objectFit === 'cover' ? "object-cover" : `object-${objectFit}`
          )}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          poster={poster}
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={onEnded}
          playsInline
        />
      </div>
    );
  }

  if (mediaType === MediaType.IMAGE) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          ref={ref as React.Ref<HTMLImageElement>}
          src={currentSrc}
          alt={alt}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isMediaVisible ? "opacity-100" : "opacity-0",
            objectFit === 'cover' ? "object-cover" : `object-${objectFit}`
          )}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectFit }}
        />
      </div>
    );
  }

  if (mediaType === MediaType.AUDIO) {
    return (
      <div className={`audio-container ${className}`}>
        <audio
          src={currentSrc}
          className="w-full"
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={onEnded}
        />
      </div>
    );
  }

  // Fallback for unknown types
  return (
    <div className={`${className} flex items-center justify-center bg-black/10 rounded`}>
      <span className="text-muted-foreground text-sm">Unsupported media format</span>
    </div>
  );
});

MediaRenderer.displayName = "MediaRenderer";
