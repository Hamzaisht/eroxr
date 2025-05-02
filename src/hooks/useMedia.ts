
import { useState, useEffect } from 'react';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';
import { MediaSource } from '@/utils/media/types';

interface UseMediaOptions {
  video_url?: string;
  media_url?: string;
}

export const useMedia = (source: UseMediaOptions | null) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!source) {
      setUrl(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const videoUrl = source.video_url || source.media_url || '';
      if (!videoUrl) {
        setUrl(null);
        setIsLoading(false);
        return;
      }

      const processedUrl = getPlayableMediaUrl(videoUrl);
      setUrl(processedUrl);
    } catch (error) {
      console.error('Error processing media URL:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [source, retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    url,
    isLoading,
    isError,
    retry,
    retryCount
  };
};
