
import { useState, useEffect, useCallback } from 'react';
import { 
  detectMediaType, 
  extractMediaUrl
} from '@/utils/media/mediaUtils';
import { MediaType } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface NewMediaRendererProps {
  item: any; // The data item containing the media URL(s)
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const NewMediaRenderer = ({
  item,
  className = '',
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  onEnded
}: NewMediaRendererProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const processMediaItem = useCallback(() => {
    // Reset state
    setIsLoading(true);
    setError(null);
    
    if (!item) {
      setUrl(null);
      setError("No media item provided");
      setIsLoading(false);
      return;
    }
    
    try {
      // Extract the media URL from the item
      const mediaUrl = extractMediaUrl(item);
      
      if (!mediaUrl) {
        setUrl(null);
        setError("Could not determine media URL");
        setIsLoading(false);
        return;
      }
      
      // Get the playable URL
      const processedUrl = getPlayableMediaUrl(mediaUrl);
      
      if (!processedUrl) {
        setUrl(null);
        setError("Failed to process media URL");
        setIsLoading(false);
        return;
      }
      
      // Determine if the media is a video
      const mediaType = detectMediaType(item);
      
      // If the mediaType is indeterminate, check content type from URL
      if (mediaType === MediaType.UNKNOWN) {
        const fileExtension = processedUrl.split('.').pop()?.toLowerCase() || '';
        setIsVideo(fileExtension.match(/(mp4|webm|mov|avi)$/i) ? true : false);
      } else {
        setIsVideo(mediaType === MediaType.VIDEO);
      }
      
      setUrl(processedUrl);
    } catch (error: any) {
      console.error('Error processing media item:', error);
      setUrl(null);
      setError(error.message || "Failed to process media");
      setIsLoading(false);
    }
  }, [item]);

  useEffect(() => {
    processMediaItem();
  }, [item, processMediaItem, retryCount]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error(`Media load error for ${isVideo ? 'video' : 'image'}: ${url}`);
    setIsLoading(false);
    setError(`Failed to load ${isVideo ? 'video' : 'image'}`);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retry attempt ${retryCount + 1} for ${url}`);
    }
    if (onError) onError();
  };

  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) return;
    
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (error || !url) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 ${className}`}>
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm">{error || "Media unavailable"}</p>
        {retryCount < MAX_RETRIES && (
          <button
            onClick={handleRetry}
            className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm flex items-center gap-2"
          >
            <RefreshCw className="h-3 w-3" /> 
            Retry
          </button>
        )}
      </div>
    );
  }

  // Render video element
  if (isVideo) {
    return (
      <video
        key={`video-${retryCount}`} // Key helps force remount on retry
        src={url}
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
        playsInline
      />
    );
  }

  // Render image element
  return (
    <img
      key={`img-${retryCount}`} // Key helps force remount on retry
      src={url}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
    />
  );
};
