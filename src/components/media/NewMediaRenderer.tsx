
import { useState, useEffect } from 'react';
import { getPlayableMediaUrl } from '@/utils/mediaUtils';
import { AlertCircle } from 'lucide-react';

interface NewMediaRendererProps {
  item: any; // The data item containing media URL(s)
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const NewMediaRenderer = ({
  item,
  className = '',
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  onLoad,
  onError,
  onEnded
}: NewMediaRendererProps) => {
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);

  useEffect(() => {
    if (!item) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Get the full media URL
      const url = getPlayableMediaUrl(item);
      
      if (!url) {
        setLoadError(true);
        setIsLoading(false);
        console.error('Could not determine media URL from item:', item);
        return;
      }

      // Determine if the media is a video based on URL or content_type
      const isVideoMedia = 
        (typeof url === 'string' && (
          url.includes('.mp4') || 
          url.includes('.webm') || 
          url.includes('.mov') || 
          url.includes('/video/')
        )) ||
        item?.content_type === 'video' ||
        item?.media_type === 'video';

      setMediaUrl(url);
      setIsVideo(isVideoMedia);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in NewMediaRenderer:', error);
      setLoadError(true);
      setIsLoading(false);
    }
  }, [item]);

  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.error(`Error loading media ${isVideo ? 'video' : 'image'}: ${mediaUrl}`);
    setLoadError(true);
    setIsLoading(false);
    if (onError) onError();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="animate-pulse">Loading media...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 ${className}`}>
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Failed to load media</p>
        {mediaUrl && <p className="text-xs mt-2 max-w-xs truncate">{mediaUrl}</p>}
      </div>
    );
  }

  return isVideo ? (
    <video
      src={mediaUrl}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      onLoadedData={handleLoad}
      onError={handleError}
      onEnded={onEnded}
    />
  ) : (
    <img
      src={mediaUrl}
      className={`object-cover ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      alt="Media content"
    />
  );
};
