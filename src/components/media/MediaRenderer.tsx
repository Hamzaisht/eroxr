
import { useState, forwardRef } from "react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { MediaType, MediaSource } from "@/utils/media/types";
import { MediaLoadingState } from "./states/MediaLoadingState";
import { MediaErrorState } from "./states/MediaErrorState";
import { Loader2 } from "lucide-react";

interface MediaRendererProps {
  source: MediaSource | string | null;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  showLoadingState?: boolean;
  showErrorState?: boolean;
  allowRetry?: boolean;
}

export const MediaRenderer = forwardRef<HTMLVideoElement | HTMLImageElement, MediaRendererProps>(({
  source,
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
  showLoadingState = true,
  showErrorState = true,
  allowRetry = true
}, ref) => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [localError, setLocalError] = useState(false);

  const {
    mediaUrl,
    mediaType,
    isLoading: isProcessing,
    isError: isProcessingError,
    retry
  } = useMediaProcessor(source, { autoLoad: true });

  const isLoading = isProcessing || (!isMediaLoaded && !localError);
  const isError = isProcessingError || localError;

  const handleLoad = () => {
    setIsMediaLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setLocalError(true);
    if (onError) onError();
  };

  const handleRetry = () => {
    setLocalError(false);
    setIsMediaLoaded(false);
    retry();
  };

  if (!source) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/10 rounded`}>
        <span className="text-muted-foreground text-sm">No media</span>
      </div>
    );
  }

  // Show loading state
  if (isLoading && showLoadingState) {
    return (
      <div className={`relative ${className} bg-black/10 flex items-center justify-center rounded`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
      </div>
    );
  }

  // Show error state
  if (isError && showErrorState) {
    return (
      <MediaErrorState 
        onRetry={allowRetry ? handleRetry : undefined}
        accessibleUrl={mediaUrl}
        retryCount={retry ? 1 : 0}
        message="Failed to load media"
      />
    );
  }

  if (!mediaUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/10 rounded`}>
        <span className="text-muted-foreground text-sm">Invalid media source</span>
      </div>
    );
  }

  // Render based on media type
  if (mediaType === MediaType.VIDEO) {
    return (
      <video
        ref={ref as React.Ref<HTMLVideoElement>}
        src={mediaUrl}
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
        playsInline
      />
    );
  }

  if (mediaType === MediaType.IMAGE) {
    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={mediaUrl}
        alt="Media content"
        className={className}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  if (mediaType === MediaType.AUDIO) {
    return (
      <audio
        src={mediaUrl}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onLoadedData={handleLoad}
        onError={handleError}
        onEnded={onEnded}
      />
    );
  }

  if (mediaType === MediaType.DOCUMENT) {
    return (
      <iframe
        src={mediaUrl}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-black/10 rounded`}>
      <span className="text-muted-foreground text-sm">Unsupported media type</span>
    </div>
  );
});

MediaRenderer.displayName = "MediaRenderer";
