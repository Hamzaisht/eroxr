
import { forwardRef, useState, useEffect, useCallback, Ref } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { extractMediaUrl, getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { MediaDisplay } from './MediaDisplay';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface MediaRendererProps extends MediaOptions {
  src: MediaSource | string | null;
  type?: MediaType;
  fallbackSrc?: string | null;
  maxRetries?: number;
  allowRetry?: boolean;
}

export const MediaRenderer = forwardRef((
  {
    src,
    type,
    fallbackSrc,
    className = '',
    autoPlay = false,
    controls = true,
    muted = true,
    loop = false,
    poster,
    maxRetries = 2,
    allowRetry = true,
    showWatermark = false,
    onClick,
    onLoad,
    onError,
    onEnded,
    onTimeUpdate
  }: MediaRendererProps,
  ref: Ref<HTMLVideoElement | HTMLImageElement>
) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(type || MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Process the media source to extract URL and determine media type
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }
    
    try {
      // Extract URL from source
      const extractedUrl = extractMediaUrl(src);
      
      // If extraction fails, try fallback
      if (!extractedUrl && fallbackSrc) {
        const fallbackUrl = typeof fallbackSrc === 'string' ? fallbackSrc : extractMediaUrl(fallbackSrc);
        if (fallbackUrl) {
          setMediaUrl(getPlayableMediaUrl(fallbackUrl));
          setMediaType(type || determineMediaType(fallbackSrc));
          setIsLoading(false);
          return;
        }
      } else if (extractedUrl) {
        setMediaUrl(getPlayableMediaUrl(extractedUrl));
        setMediaType(type || determineMediaType(src));
        setIsLoading(false);
        return;
      }
      
      // If we got here, no valid URL was found
      setIsLoading(false);
      setHasError(true);
    } catch (err) {
      console.error('Error processing media source:', err);
      setIsLoading(false);
      setHasError(true);
    }
  }, [src, fallbackSrc, type, retryCount]);
  
  // Handle successful media loading
  const handleLoad = useCallback(() => {
    setHasError(false);
    if (onLoad) onLoad();
  }, [onLoad]);
  
  // Handle media loading error
  const handleError = useCallback(() => {
    console.error('Media error:', mediaUrl);
    
    // If we have retries left and retry is allowed, try again
    if (retryCount < maxRetries && allowRetry) {
      // Add cache busting
      setRetryCount(prevCount => prevCount + 1);
    } else {
      setHasError(true);
      if (onError) onError();
    }
  }, [mediaUrl, retryCount, maxRetries, allowRetry, onError]);
  
  // Handle manual retry
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/10 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }
  
  // Show error state with retry option
  if (hasError || !mediaUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-black/10 ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-400 mb-3">Failed to load media</p>
        {allowRetry && (
          <button
            onClick={handleRetry}
            className="flex items-center text-xs gap-1 px-2 py-1 bg-primary/20 hover:bg-primary/30 rounded text-primary"
          >
            <RefreshCw className="w-3 h-3" /> Try Again
          </button>
        )}
      </div>
    );
  }
  
  // Render the actual media
  return (
    <MediaDisplay
      ref={ref}
      mediaUrl={mediaUrl}
      mediaType={mediaType}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
    />
  );
});

MediaRenderer.displayName = 'MediaRenderer';
