import { useState, useEffect, forwardRef, Ref, useRef, memo, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { MediaType } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { reportMediaError, reportMediaSuccess } from '@/utils/media/mediaMonitoring';
import { mediaOrchestrator } from '@/utils/media/mediaOrchestrator';

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
  style?: React.CSSProperties;
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
  maxRetries = 2,
  style = {}
}: MediaRendererProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(initialType || MediaType.UNKNOWN);
  const [loadStartTime, setLoadStartTime] = useState(Date.now());
  const [mediaId, setMediaId] = useState<string>("");
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [forceDisplay, setForceDisplay] = useState(false);
  
  const processedRef = useRef<boolean>(false);
  const sourceRef = useRef(src);
  const previousUrl = useRef<string | null>(null);
  const stableObjectFit = useMemo(() => ({ objectFit: style.objectFit || 'cover' }), [style.objectFit]);
  
  // Stable source object reference that won't change on every render
  const stableSource = useMemo(() => {
    if (typeof src === 'string') return src;
    if (!src) return null;
    return src;
  }, [src]);
  
  // Generate a stable media ID on mount or when source significantly changes
  useEffect(() => {
    if (stableSource === sourceRef.current && mediaId) {
      return; // Skip if source hasn't changed and we already have an ID
    }
    
    try {
      const newMediaId = mediaOrchestrator.createMediaId(stableSource);
      setMediaId(newMediaId);
      sourceRef.current = stableSource;
    } catch (error) {
      console.error('Error creating media ID:', error);
    }
  }, [stableSource, mediaId]);
  
  // Set a timeout to force display content even if orchestration is slow
  useEffect(() => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    // After 4 seconds, display content anyway even if not fully loaded
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Media load timeout - forcing display:', url);
        setIsLoading(false);
        setForceDisplay(true);
      }
    }, 4000);
    
    setLoadingTimeout(timeout);
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [url, isLoading]);
  
  // Process the source URL on component mount or when source significantly changes
  useEffect(() => {
    // Skip if we don't have a mediaId yet
    if (!mediaId) return;
    
    setLoadStartTime(Date.now());
    
    try {
      // Determine media type if not explicitly provided
      if (!initialType) {
        const detectedType = determineMediaType(stableSource);
        setMediaType(detectedType);
      } else {
        setMediaType(initialType);
      }

      // Register the source with the orchestrator and get a playable URL
      mediaOrchestrator.registerMediaRequest(stableSource);
      const processedUrl = stableSource ? mediaOrchestrator.getStableUrl(stableSource) : null;
      
      // Only update URL if it's different to prevent unnecessary re-renders
      if (processedUrl !== previousUrl.current) {
        previousUrl.current = processedUrl;
        setUrl(processedUrl);
        setIsLoading(true);
        setHasError(false);
        setForceDisplay(false);
      }
    } catch (err) {
      console.error('Error processing media:', err);
      setHasError(true);
      setIsLoading(false);
      
      // Try fallback if available
      if (fallbackSrc) {
        try {
          const fallbackUrl = mediaOrchestrator.getStableUrl(fallbackSrc);
          if (fallbackUrl !== previousUrl.current) {
            previousUrl.current = fallbackUrl;
            setUrl(fallbackUrl);
            setIsLoading(true);
            setHasError(false);
            setForceDisplay(false);
          }
        } catch (fallbackErr) {
          console.error('Error processing fallback media:', fallbackErr);
        }
      }
    } finally {
      processedRef.current = true;
    }
  }, [stableSource, initialType, fallbackSrc, retryCount, mediaId]);

  // Handle successful media load
  const handleLoad = useCallback(() => {
    const loadTime = Date.now() - loadStartTime;
    setIsLoading(false);
    setHasError(false);
    
    // Report successful media load for monitoring
    try {
      if (url) {
        reportMediaSuccess(url, loadTime, mediaType === MediaType.VIDEO ? 'video' : 'image');
      }
    } catch (error) {
      console.error("Error reporting media success:", error);
    }
    
    if (onLoad) onLoad();
  }, [loadStartTime, url, mediaType, onLoad]);

  // Handle media loading error
  const handleError = useCallback(() => {
    console.error(`Media loading error: ${url}, type: ${mediaType}, mediaId: ${mediaId}`);
    setIsLoading(false);
    setHasError(true);
    
    // Report media error for monitoring
    try {
      if (url) {
        reportMediaError(
          url,
          'load_failure',
          retryCount,
          mediaType === MediaType.VIDEO ? 'video' : 'image',
          'MediaRenderer'
        );
      }
    } catch (error) {
      console.error("Error reporting media error:", error);
    }
    
    // Try fallback if available
    if (fallbackSrc && url && !url.includes(fallbackSrc)) {
      try {
        const fallbackUrl = mediaOrchestrator.getStableUrl(fallbackSrc);
        if (fallbackUrl !== previousUrl.current) {
          previousUrl.current = fallbackUrl;
          setUrl(fallbackUrl);
          setIsLoading(true);
          setHasError(false);
        }
      } catch (fallbackErr) {
        console.error('Error processing fallback media:', fallbackErr);
      }
    }
    
    if (onError) onError();
  }, [url, fallbackSrc, retryCount, mediaType, onError, mediaId]);

  // Handle media retry
  const handleRetry = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for media:`, url);
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setForceDisplay(false);
    previousUrl.current = null; // Clear previous URL to force a refresh
  }, [retryCount, maxRetries, url]);

  // Handle video time updates
  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  }, [onTimeUpdate]);

  // If we have a media ID but media orchestrator is having issues, force display after timeout
  if (!isLoading && forceDisplay && url) {
    if (mediaType === MediaType.VIDEO) {
      return (
        <div className="relative w-full h-full">
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
            key={`video-forced-${mediaId}-${retryCount}`}
            style={stableObjectFit}
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
              eroxr
            </div>
          )}
        </div>
      );
    } else if (mediaType === MediaType.IMAGE || mediaType === MediaType.GIF) {
      return (
        <div className="relative w-full h-full">
          <img
            ref={ref as React.RefObject<HTMLImageElement>}
            src={url}
            className={className}
            alt="Media content"
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            key={`image-forced-${mediaId}-${retryCount}`}
            style={stableObjectFit}
          />
          {showWatermark && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded opacity-70 hover:opacity-100 transition-opacity">
              eroxr
            </div>
          )}
        </div>
      );
    }
  }

  // Show loading indicator (with timeout)
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
            key={`video-${mediaId}-${retryCount}`}
            style={stableObjectFit}
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
            key={`image-${mediaId}-${retryCount}`}
            style={stableObjectFit}
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
}), (prevProps, nextProps) => {
  // Enhanced equality check with media IDs for better stability
  try {
    const prevId = mediaOrchestrator.createMediaId(prevProps.src);
    const nextId = mediaOrchestrator.createMediaId(nextProps.src);
    
    // If IDs are different, we need to re-render
    if (prevId !== nextId) return false;
    
    // Otherwise, check other props that would require re-render
    return prevProps.className === nextProps.className &&
           prevProps.autoPlay === nextProps.autoPlay &&
           prevProps.muted === nextProps.muted &&
           prevProps.controls === nextProps.controls;
  } catch (error) {
    // If there's an error in comparison, force re-render
    return false;
  }
});

MediaRenderer.displayName = 'MediaRenderer';
