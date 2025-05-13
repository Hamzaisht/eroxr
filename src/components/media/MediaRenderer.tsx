
import { useState, useEffect } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { MediaDisplay } from './MediaDisplay';
import { extractMediaUrl } from '@/utils/media/urlUtils';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

interface MediaRendererProps extends MediaOptions {
  /**
   * The media source to render (string URL or MediaSource object)
   */
  src: string | MediaSource;
  
  /**
   * Media type override (optional)
   */
  type?: MediaType;
  
  /**
   * Allow retry on error
   */
  allowRetry?: boolean;
  
  /**
   * Maximum number of retries
   */
  maxRetries?: number;
}

/**
 * A smart media renderer that handles various media types
 */
export function MediaRenderer({
  src,
  type,
  className,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onError,
  onLoad,
  onEnded,
  onTimeUpdate,
  allowRetry = false,
  maxRetries = 2
}: MediaRendererProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(type || MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Process the media source to normalize it
  useEffect(() => {
    try {
      // Normalize the media source
      const normalized = normalizeMediaSource(src);
      
      // Extract the URL
      const url = extractMediaUrl(normalized);
      if (!url) {
        throw new Error("Could not extract media URL");
      }
      
      setMediaUrl(url);
      
      // Set media type from prop or from normalized source
      setMediaType(type || normalized.media_type || MediaType.UNKNOWN);
      
      setIsLoading(false);
      setError(null);
    } catch (err: any) {
      console.error("Error processing media source:", err);
      setError(err.message || "Failed to process media");
      setIsLoading(false);
    }
  }, [src, type]);
  
  const handleError = () => {
    if (allowRetry && retryCount < maxRetries) {
      // Retry loading with a slight delay
      setRetryCount(count => count + 1);
      setTimeout(() => {
        // Force remount by temporarily clearing the URL
        setMediaUrl(null);
        setTimeout(() => {
          const normalized = normalizeMediaSource(src);
          const url = extractMediaUrl(normalized);
          if (url) setMediaUrl(url);
        }, 50);
      }, 1000);
      
      console.log(`Media load retry ${retryCount + 1}/${maxRetries}`);
    } else {
      setError("Failed to load media");
      if (onError) onError();
    }
  };
  
  const handleLoad = () => {
    setError(null);
    if (onLoad) onLoad();
  };
  
  // Show loading or error state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/20 ${className}`}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (error || !mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-black/20 ${className}`}>
        <div className="text-red-500">{error || "Media unavailable"}</div>
      </div>
    );
  }
  
  // Render the appropriate media component
  return (
    <MediaDisplay
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
}
