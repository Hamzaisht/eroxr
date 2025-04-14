
import { useState, useEffect } from 'react';
import { getPlayableMediaUrl, getContentType } from '@/utils/media/mediaUtils';
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
      // Get the media URL
      const mediaUrl = getPlayableMediaUrl(item);
      
      if (!mediaUrl) {
        setUrl(null);
        setError("Could not determine media URL");
        setIsLoading(false);
        return;
      }
      
      // Determine if the media is a video
      let mediaType: "video" | "image" = "image";
      
      if (typeof item === 'object') {
        // Check if content_type or media_type is specified in the item
        if (item.content_type === 'video' || item.media_type === 'video') {
          mediaType = "video";
        } else if (item.video_url || (item.video_urls && item.video_urls.length > 0)) {
          mediaType = "video";
        }
      }
      
      if (mediaType === "image") {
        // Try to determine type from URL if not specified in item
        mediaType = getContentType(mediaUrl);
      }
      
      setIsVideo(mediaType === "video");
      setUrl(mediaUrl);
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
          onClick={handleRetry}
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
      src={url}
      className={className}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
    />
  );
};
