
import { useState, useEffect, forwardRef, Ref } from 'react';
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { MediaType } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { reportMediaError, reportMediaSuccess } from '@/utils/media/mediaMonitoring';

interface MediaRendererProps {
  src: string | any | null;
  type?: MediaType;
  className?: string;
  fallbackSrc?: string;
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
  onTimeUpdate?: (currentTime: number) => void;
  allowRetry?: boolean;
  maxRetries?: number;
}

export const MediaRenderer = forwardRef(({
  src,
  type: initialType,
  className = "",
  fallbackSrc,
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
  onTimeUpdate,
  allowRetry = true,
  maxRetries = 2
}: MediaRendererProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(initialType || MediaType.UNKNOWN);
  const [loadStartTime, setLoadStartTime] = useState(Date.now());
  
  // Process the source URL on component mount or when source changes
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setLoadStartTime(Date.now());

    try {
      // Determine media type if not explicitly provided
      if (!initialType) {
        const detectedType = determineMediaType(src);
        setMediaType(detectedType);
      }

      // Get a playable URL (handles various formats, cache busting, etc)
      const processedUrl = getPlayableMediaUrl(src);
      setUrl(processedUrl);
    } catch (err) {
      console.error('Error processing media:', err);
      setHasError(true);
      
      if (onError) onError();
      
      // Try fallback if available
      if (fallbackSrc) {
        setUrl(fallbackSrc);
      }
    } finally {
      setIsLoading(false);
    }
  }, [src, initialType, fallbackSrc, retryCount]);

  // Handle successful media load
  const handleLoad = () => {
    const loadTime = Date.now() - loadStartTime;
    setIsLoading(false);
    setHasError(false);
    
    // Report successful media load for monitoring
    reportMediaSuccess(url, loadTime, mediaType === MediaType.VIDEO ? 'video' : 'image');
    
    if (onLoad) onLoad();
  };

  // Handle media loading error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Report media error for monitoring
    reportMediaError(
      url,
      'load_failure',
      retryCount,
      mediaType === MediaType.VIDEO ? 'video' : 'image',
      'MediaRenderer'
    );
    
    // Try fallback if available
    if (fallbackSrc && !url?.includes(fallbackSrc)) {
      setUrl(fallbackSrc);
    }
    
    if (onError) onError();
  };

  // Handle media retry
  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for media:`, url);
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
  };

  // Handle video time updates
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-black/10 w-full h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show error with retry button
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center bg-black/10 w-full h-full p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-500 mb-3 text-center">Failed to load media</p>
        
        {allowRetry && retryCount < maxRetries && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/90 hover:bg-primary text-white text-sm rounded-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  // Render video player
  if (mediaType === MediaType.VIDEO) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={url || undefined}
          className={className}
          poster={poster}
          autoPlay={autoPlay}
          controls={controls}
          muted={muted}
          loop={loop}
          playsInline
          onClick={onClick}
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // Render image
  if (mediaType === MediaType.IMAGE || mediaType === MediaType.GIF) {
    return (
      <div className="relative w-full h-full">
        <img
          ref={ref as React.RefObject<HTMLImageElement>}
          src={url || undefined}
          className={className}
          alt="Media content"
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
        />
        {showWatermark && (
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
            eroxr
          </div>
        )}
      </div>
    );
  }

  // For audio files
  if (mediaType === MediaType.AUDIO) {
    return (
      <div className="audio-player w-full">
        <audio
          src={url || undefined}
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

  // Fallback for unsupported or unknown types
  return (
    <div className="flex items-center justify-center bg-black/10 w-full h-full">
      <p className="text-sm text-gray-500">Unsupported media format</p>
    </div>
  );
});

MediaRenderer.displayName = 'MediaRenderer';
