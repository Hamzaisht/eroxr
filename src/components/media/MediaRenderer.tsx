
import { useState, useEffect, forwardRef, Ref } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { MediaType } from '@/utils/media/types';
import { useMediaService } from '@/hooks/useMediaService';
import { cn } from '@/lib/utils';

interface MediaRendererProps {
  src: string | any; // Accept string or object with media properties
  type?: MediaType | string;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  fallbackSrc?: string; // Add fallbackSrc prop
  showWatermark?: boolean;
  allowRetry?: boolean;
  maxRetries?: number;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onClick?: () => void;
  alt?: string;
}

export const MediaRenderer = forwardRef((
  { 
    src,
    type,
    className = '',
    objectFit = 'cover',
    controls = true,
    autoPlay = false,
    muted = true,
    loop = false,
    poster,
    fallbackSrc, // Add fallbackSrc prop
    showWatermark = false,
    allowRetry = true,
    maxRetries = 2,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate,
    onClick,
    alt = 'Media content'
  }: MediaRendererProps,
  ref: Ref<HTMLVideoElement | HTMLImageElement>
) => {
  const [errorShown, setErrorShown] = useState<boolean>(false);

  // Use our centralized media service
  const media = useMediaService(src, {
    maxRetries,
    onLoad,
    onError: () => {
      setErrorShown(true);
      if (onError) onError();
    }
  });

  // Force the media type if provided
  const mediaType = type ? 
    (typeof type === 'string' ? type as MediaType : type) : 
    media.mediaType;

  // Clear error shown state on new source
  useEffect(() => {
    setErrorShown(false);
  }, [src]);

  // Handle video time update
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  };

  // Loading state
  if (media.isLoading) {
    return (
      <div className={cn("flex items-center justify-center bg-black/20 rounded", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
      </div>
    );
  }

  // Error state with retry button
  if ((media.hasError && errorShown) || !media.url) {
    // Try to use fallbackSrc if available
    if (fallbackSrc) {
      return (
        <div className="relative w-full h-full">
          <img
            src={fallbackSrc}
            className={className}
            style={{ objectFit }}
            alt={alt}
            onError={() => {
              if (onError) onError();
            }}
          />
        </div>
      );
    }
    
    return (
      <div className={cn("flex flex-col items-center justify-center bg-black/20 p-4 rounded", className)}>
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-500 mb-3 text-center">
          {media.errorMessage || 'Failed to load media'}
        </p>
        {allowRetry && (
          <button
            onClick={() => {
              setErrorShown(false);
              media.retry();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 hover:bg-primary text-white text-sm rounded-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  // Render video content
  if (mediaType === MediaType.VIDEO) {
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
          onLoadedData={() => {
            if (onLoad) onLoad();
          }}
          onError={() => {
            media.retryWithBackoff();
            setErrorShown(true);
            if (onError) onError();
          }}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // Render image content
  if (mediaType === MediaType.IMAGE) {
    return (
      <div className="relative w-full h-full">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={media.url || undefined}
          className={className}
          style={{ objectFit }}
          onClick={onClick}
          onLoad={() => {
            if (onLoad) onLoad();
          }}
          onError={() => {
            media.retryWithBackoff();
            setErrorShown(true);
            if (onError) onError();
          }}
          alt={alt}
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // Render audio content
  if (mediaType === MediaType.AUDIO) {
    return (
      <div className={cn("audio-player", className)}>
        <audio
          src={media.url || undefined}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          onLoadedData={() => {
            if (onLoad) onLoad();
          }}
          onError={() => {
            media.retryWithBackoff(); 
            if (onError) onError();
          }}
          onEnded={onEnded}
          className="w-full"
        />
      </div>
    );
  }

  // Fallback for unsupported types
  return (
    <div className={cn("flex items-center justify-center bg-black/10", className)}>
      <p className="text-sm text-gray-500">Unsupported media format</p>
    </div>
  );
});

MediaRenderer.displayName = 'MediaRenderer';
