
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
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
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
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
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
      
      console.log('Extracted URL:', url);

      // For blob: or data: URLs, use them directly without processing
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        console.log('Using direct blob/data URL without processing');
        setMediaUrl(url);
        setIsLoading(false);
        return;
      }

      // Use getPlayableMediaUrl to process remote URLs
      const playableUrl = getPlayableMediaUrl(url);
      console.log('Processed to playable URL:', playableUrl);
      setMediaUrl(playableUrl);
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
    
    return () => {
      // Clean up any resources if needed
    };
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
          className="mt-2 flex items-center gap-1 px-3 py-1 rounded-md bg-luxury-darker hover:bg-luxury-dark text-luxury-neutral text-sm"
        >
          <RefreshCw size={14} className="mr-1" />
          Retry
        </button>
        
        {/* Add debug info in development mode */}
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

  // Handle special case for direct file/blob URLs which should skip URL processing
  const finalUrl = mediaUrl.startsWith('blob:') || mediaUrl.startsWith('data:') 
    ? mediaUrl 
    : mediaUrl;

  if (mediaType === MediaType.VIDEO) {
    return (
      <video
        ref={ref as React.RefObject<HTMLVideoElement>}
        src={finalUrl}
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
      src={finalUrl}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
    />
  );
});

Media.displayName = 'Media';
