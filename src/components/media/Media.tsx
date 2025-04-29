import { forwardRef, useState, useEffect, useCallback } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

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
  onTimeUpdate?: (currentTime: number) => void;
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

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (error || !mediaUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className} bg-luxury-darker/50`}>
        <AlertCircle className="h-8 w-8 text-luxury-neutral/50 mb-2" />
        <p className="text-sm text-luxury-neutral/70">Media unavailable</p>
        <button 
          onClick={() => setRetryCount(prev => prev + 1)} 
          className="mt-2 flex items-center gap-1 px-3 py-1 rounded-md bg-luxury-darker hover:bg-luxury-dark text-luxury-neutral text-sm"
        >
          <RefreshCw size={14} className="mr-1" />
          Retry
        </button>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 text-xs bg-black/50 text-luxury-neutral/70 rounded max-w-full overflow-auto">
            <p>URL: {mediaUrl || 'none'}</p>
            <p>Type: {mediaType}</p>
            <p>Error: {error}</p>
            <p>Retries: {retryCount}</p>
          </div>
        )}
      </div>
    );
  }

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
        onLoadedData={onLoad}
        onError={onError}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        playsInline
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <img
      ref={ref as React.RefObject<HTMLImageElement>}
      src={mediaUrl}
      className={className}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      alt="Media content"
      crossOrigin="anonymous"
    />
  );
});

Media.displayName = 'Media';
