
import { useState, useEffect, useCallback } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';

interface UseMediaServiceOptions {
  maxRetries?: number;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * Hook to handle all media processing logic consistently across the app
 */
export function useMediaService(
  source: MediaSource | string | null, 
  options: UseMediaServiceOptions = {}
) {
  const [url, setUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  console.log("useMediaService called with source:", source);
  
  // Extract and process URL from the source
  useEffect(() => {
    if (!source) {
      console.error("useMediaService: No source provided");
      setUrl(null);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("No media source provided");
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    
    try {
      // Determine media type
      const detectedType = determineMediaType(source);
      setMediaType(detectedType);
      console.log("useMediaService detected media type:", detectedType);
      
      // Extract the media URL
      const sourceUrl = extractMediaUrl(source);
      console.log("useMediaService extracted URL:", sourceUrl);
      
      if (!sourceUrl) {
        console.error("useMediaService: Could not extract URL from source");
        setIsLoading(false);
        setHasError(true);
        setErrorMessage("Could not extract media URL");
        return;
      }
      
      // Get thumbnail URL if available
      if (typeof source === 'object' && source !== null) {
        const thumbUrl = source.thumbnail_url || source.video_thumbnail_url || source.poster;
        if (thumbUrl) {
          console.log("useMediaService found thumbnail URL:", thumbUrl);
          setThumbnailUrl(thumbUrl);
        }
      }
      
      // Get playable URL
      const playableUrl = getPlayableMediaUrl(sourceUrl);
      console.log("useMediaService final playable URL:", playableUrl);
      setUrl(playableUrl);
    } catch (error) {
      console.error("useMediaService error processing source:", error);
      setHasError(true);
      setErrorMessage(`Error processing media: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [source, retryCount]);
  
  // Handle successful media load
  const handleLoad = useCallback(() => {
    console.log("useMediaService: Media loaded successfully:", url);
    setHasError(false);
    setErrorMessage(null);
    if (options.onLoad) options.onLoad();
  }, [url, options]);
  
  // Handle media error
  const handleError = useCallback(() => {
    console.error("useMediaService: Media load error:", url);
    setHasError(true);
    setErrorMessage(`Failed to load ${mediaType === MediaType.VIDEO ? 'video' : 'image'}`);
    if (options.onError) options.onError();
  }, [url, mediaType, options]);
  
  // Retry loading media
  const retry = useCallback(() => {
    if (retryCount >= (options.maxRetries || 2)) {
      console.warn("useMediaService: Maximum retry count reached");
      return;
    }
    
    console.log(`useMediaService: Retrying (${retryCount + 1}/${options.maxRetries || 2})`);
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
  }, [retryCount, options.maxRetries]);
  
  return {
    url,
    thumbnailUrl,
    mediaType,
    isLoading,
    hasError,
    errorMessage,
    retry,
    handleLoad,
    handleError
  };
}
