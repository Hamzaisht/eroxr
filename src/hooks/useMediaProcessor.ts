
import { useState, useEffect, useCallback } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { 
  determineMediaType, 
  extractMediaUrl
} from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';

interface UseMediaProcessorOptions {
  autoLoad?: boolean;
}

export function useMediaProcessor(source: MediaSource | string | null, options: UseMediaProcessorOptions = {}) {
  const { autoLoad = true } = options;
  
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processMedia = useCallback(async () => {
    if (!source) {
      setIsError(true);
      setError('No media source provided');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      // Extract URL from source
      const extractedUrl = extractMediaUrl(source);
      if (!extractedUrl) {
        setIsError(true);
        setError('Could not extract media URL');
        return;
      }
      
      // Get playable URL
      const playableUrl = getPlayableMediaUrl(extractedUrl);
      setMediaUrl(playableUrl);
      
      // Determine media type
      // Use the string URL for media type detection
      const type = determineMediaType(extractedUrl);
      setMediaType(type as MediaType);
    } catch (err: any) {
      console.error('Error processing media:', err);
      setIsError(true);
      setError(err.message || 'Failed to process media');
    } finally {
      setIsLoading(false);
    }
  }, [source]);
  
  // Process media on mount or when source changes (if autoLoad is true)
  useEffect(() => {
    if (autoLoad) {
      processMedia();
    }
  }, [processMedia, autoLoad]);
  
  // Function to retry processing
  const retry = useCallback(() => {
    processMedia();
  }, [processMedia]);

  return {
    mediaUrl,
    mediaType,
    isLoading,
    isError,
    error,
    processMedia,
    retry
  };
}
