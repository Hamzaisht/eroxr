
import { forwardRef, useState, useEffect } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface MediaProps extends MediaOptions {
  source: MediaSource | string;
}

export const Media = forwardRef<HTMLVideoElement | HTMLImageElement, MediaProps>(({
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
  onTimeUpdate
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!source) {
      setError('No media source provided');
      setIsLoading(false);
      return;
    }

    try {
      const type = determineMediaType(source);
      setMediaType(type);

      const url = typeof source === 'string' 
        ? source 
        : extractMediaUrl(source);

      if (!url) {
        setError('Could not extract media URL');
        setIsLoading(false);
        return;
      }

      const playableUrl = getPlayableMediaUrl(url);
      setMediaUrl(playableUrl);
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Error processing media');
    } finally {
      setIsLoading(false);
    }
  }, [source, retryCount]);

  const handleLoad = () => {
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError('Failed to load media');
    if (onError) onError();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
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
          onClick={handleRetry}
          className="mt-2 flex items-center gap-1 px-2 py-1 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded text-xs"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      </div>
    );
  }

  if (mediaType === MediaType.VIDEO) {
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
  }

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
});

Media.displayName = 'Media';
