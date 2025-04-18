
import { forwardRef, useState, useEffect, useCallback } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { Loader2, AlertCircle } from 'lucide-react';

interface MediaProps extends MediaOptions {
  source: MediaSource | string;
  showWatermark?: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | string>(MediaType.UNKNOWN);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const processMediaSource = useCallback(async () => {
    if (!source) {
      setError('No media source provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Processing media source:', 
        typeof source === 'string' ? source : 'Media object');
      
      const type = determineMediaType(source);
      setMediaType(type);
      console.log('Media type determined:', type);

      const url = typeof source === 'string' 
        ? source 
        : extractMediaUrl(source);

      if (!url) {
        setError('Could not extract media URL');
        setIsLoading(false);
        return;
      }
      
      // Get playable URL with cache busting to avoid caching issues
      const processedUrl = getPlayableMediaUrl(url);
      console.log('Processed URL:', processedUrl);
      
      setMediaUrl(processedUrl);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Error processing media');
      setIsLoading(false);
    }
  }, [source]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    processMediaSource();
  }, [source, processMediaSource, retryCount]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const handleLoad = () => {
    console.log('Media loaded successfully');
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error('Failed to load media:', mediaUrl);
    setError('Failed to load media');
    if (onError) onError();
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (onTimeUpdate) {
      const video = e.currentTarget;
      onTimeUpdate(video.currentTime);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative flex items-center justify-center bg-black/30 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-white/70" />
      </div>
    );
  }

  // Error state
  if (error || !mediaUrl) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-black/30 ${className}`}>
        <AlertCircle className="h-8 w-8 mb-2 text-white/70" />
        <p className="text-sm text-white/70 mb-2">{error || "Media unavailable"}</p>
        <button
          onClick={handleRetry}
          className="px-3 py-1 bg-luxury-primary/80 text-white rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render video element
  if (mediaType === MediaType.VIDEO || mediaType === 'video') {
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
        onTimeUpdate={handleTimeUpdate}
        playsInline
        crossOrigin="anonymous"
      />
    );
  }

  // Render image element
  return (
    <img
      ref={ref as React.RefObject<HTMLImageElement>}
      src={mediaUrl}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
      crossOrigin="anonymous"
    />
  );
});

Media.displayName = 'Media';
