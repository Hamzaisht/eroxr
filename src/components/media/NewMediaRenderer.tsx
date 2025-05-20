
import { useState, useEffect } from 'react';
import { 
  determineMediaType, 
  extractMediaUrl
} from '@/utils/media/mediaUtils';
import { MediaType } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { AlertCircle, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    // Reset state when item changes
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
      const mediaType = determineMediaType(item);
      
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
  }, [item, retryCount]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error(`Media load error for ${isVideo ? 'video' : 'image'}: ${url}`);
    setIsLoading(false);
    setError(`Failed to load ${isVideo ? 'video' : 'image'}`);
    if (onError) onError();
  };

  const handleRetry = () => {
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
        <button
          onClick={() => setRetryCount(prev => prev + 1)}
          className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render video element
  if (isVideo) {
    return (
      <video
        src={url}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        poster={poster}
        onClick={onClick}
        onLoadedData={() => {
          setIsLoading(false);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setError('Failed to load video');
          if (onError) onError();
        }}
        onEnded={onEnded}
        playsInline
      />
    );
  }

  // Render image element
  return (
    <img
      src={url}
      className={className}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false);
        if (onLoad) onLoad();
      }}
      onError={() => {
        setError('Failed to load image');
        if (onError) onError();
      }}
      alt="Media content"
    />
  );
};
