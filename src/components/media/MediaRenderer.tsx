
import { useState, useEffect, forwardRef, Ref, useRef, memo, useCallback } from 'react';
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

export const MediaRenderer = memo(forwardRef(({
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
  const processedRef = useRef<boolean>(false);
  const sourceRef = useRef(src);
  
  // Process the source URL on component mount or when source significantly changes
  useEffect(() => {
    const currentSrc = JSON.stringify(src);
    const prevSrc = JSON.stringify(sourceRef.current);
    const hasSourceChanged = currentSrc !== prevSrc;
    
    if (!hasSourceChanged && processedRef.current) {
      return; // Skip if source hasn't changed and we've already processed it
    }
    
    sourceRef.current = src;
    setIsLoading(true);
    setHasError(false);
    setLoadStartTime(Date.now());
    processedRef.current = true;

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
        try {
          const fallbackUrl = getPlayableMediaUrl(fallbackSrc);
          setUrl(fallbackUrl);
        } catch (fallbackErr) {
          console.error('Error processing fallback media:', fallbackErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [src, initialType, fallbackSrc, retryCount]);

  // Handle successful media load
  const handleLoad = useCallback(() => {
    const loadTime = Date.now() - loadStartTime;
    setIsLoading(false);
    setHasError(false);
    
    // Report successful media load for monitoring
    try {
      reportMediaSuccess(url, loadTime, mediaType === MediaType.VIDEO ? 'video' : 'image');
    } catch (error) {
      console.error("Error reporting media success:", error);
    }
    
    if (onLoad) onLoad();
  }, [loadStartTime, url, mediaType, onLoad]);

  // Handle media loading error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // Report media error for monitoring
    try {
      reportMediaError(
        url,
        'load_failure',
        retryCount,
        mediaType === MediaType.VIDEO ? 'video' : 'image',
        'MediaRenderer'
      );
    } catch (error) {
      console.error("Error reporting media error:", error);
    }
    
    // Try fallback if available
    if (fallbackSrc && !url?.includes(fallbackSrc)) {
      try {
        const fallbackUrl = getPlayableMediaUrl(fallbackSrc);
        setUrl(fallbackUrl);
      } catch (fallbackErr) {
        console.error('Error processing fallback media:', fallbackErr);
      }
    }
    
    if (onError) onError();
  }, [url, fallbackSrc, retryCount, mediaType, onError]);

  // Handle media retry
  const handleRetry = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for media:`, url);
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
  }, [retryCount, maxRetries, url]);

  // Handle video time updates
  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  }, [onTimeUpdate]);

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
        {url ? (
          <video
            ref={ref as React.RefObject<HTMLVideoElement>}
            src={url}
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
            key={`video-${url}`}
          />
        ) : (
          <div className="flex items-center justify-center bg-black/50 w-full h-full">
            <p className="text-white/80">No video source available</p>
          </div>
        )}
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
        {url ? (
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={url}
            className={className}
            alt="Media content"
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            key={`image-${url}`}
          />
        ) : (
          <div className="flex items-center justify-center bg-black/50 w-full h-full">
            <p className="text-white/80">No image source available</p>
          </div>
        )}
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
        {url ? (
          <audio
            src={url}
            className="w-full"
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            onLoadedData={handleLoad}
            onError={handleError}
            onEnded={onEnded}
          />
        ) : (
          <div className="flex items-center justify-center bg-black/50 w-full h-full p-2">
            <p className="text-white/80">No audio source available</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback for unsupported or unknown types
  return (
    <div className="flex items-center justify-center bg-black/10 w-full h-full">
      <p className="text-sm text-gray-500">Unsupported media format</p>
    </div>
  );
}));

MediaRenderer.displayName = 'MediaRenderer';
