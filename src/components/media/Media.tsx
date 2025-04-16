
import { forwardRef, useState, useEffect } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { useMedia } from '@/hooks/useMedia';
import { Loader2, AlertCircle } from 'lucide-react';

interface MediaProps {
  source: MediaSource | string;
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

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>(({
  source,
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
  const [localError, setLocalError] = useState<boolean>(false);
  const [localLoaded, setLocalLoaded] = useState<boolean>(false);

  const {
    url: mediaUrl,
    mediaType,
    isLoading,
    isError: mediaError,
    errorMessage,
    retry
  } = useMedia(source, {
    autoLoad: true,
    onError: (err) => console.error("Media processing error:", err)
  });

  useEffect(() => {
    // Reset local state when source changes
    setLocalError(false);
    setLocalLoaded(false);
  }, [source]);

  const handleLoad = () => {
    setLocalLoaded(true);
    setLocalError(false);
    console.log(`Media loaded successfully: ${mediaUrl}`);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setLocalError(true);
    setLocalLoaded(false);
    console.error(`Media render error: ${mediaUrl}`);
    if (onError) onError();
  };

  const handleRetry = () => {
    setLocalError(false);
    retry();
  };

  const isError = mediaError || localError;
  const isReady = !isLoading && !isError && mediaUrl;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className || 'h-48 w-full'}`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex flex-col items-center justify-center ${className || 'h-48 w-full'} bg-black/10 rounded-md`}>
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground mb-3">{errorMessage || "Failed to load media"}</p>
        <button
          onClick={handleRetry}
          className="px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!mediaUrl) {
    return (
      <div className={`flex items-center justify-center ${className || 'h-48 w-full'} bg-black/10 rounded-md`}>
        <span className="text-sm text-muted-foreground">No media source</span>
      </div>
    );
  }

  // Render based on media type
  switch (mediaType) {
    case MediaType.VIDEO:
      return (
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
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
          onTimeUpdate={onTimeUpdate}
          playsInline
        />
      );

    case MediaType.IMAGE:
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          alt="Media content"
        />
      );

    case MediaType.AUDIO:
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

    case MediaType.DOCUMENT:
      return (
        <iframe
          src={mediaUrl}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
        />
      );

    default:
      // Fallback to image rendering for unknown types
      return (
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          className={className}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          alt="Media content"
        />
      );
  }
});

Media.displayName = 'Media';
