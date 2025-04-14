
import { useState, useEffect, useCallback } from 'react';
import { addCacheBuster } from '@/utils/media/getPlayableMediaUrl';
import { getPlayableMediaUrl } from '@/utils/media/getPlayableMediaUrl';

interface MediaHandlerOptions {
  item: any; // The data item containing the media URL
  onLoad?: () => void;
  onError?: () => void;
  maxRetries?: number;
  initialDelay?: number;
}

export const useMediaHandler = ({
  item,
  onLoad,
  onError,
  maxRetries = 3,
  initialDelay = 500
}: MediaHandlerOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [accessibleUrl, setAccessibleUrl] = useState<string | null>(null);
  const [effectiveUrl, setEffectiveUrl] = useState<string | null>(null);
  const [isVideoContent, setIsVideoContent] = useState(false);

  // Determine the URL to use and detect media type
  useEffect(() => {
    const determineMedia = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Get the URL from various possible properties
        const mediaUrl = getPlayableMediaUrl(item);
        
        if (!mediaUrl) {
          setAccessibleUrl(null);
          setEffectiveUrl(null);
          setIsLoading(false);
          setLoadError(true);
          return;
        }
        
        // Determine if it's a video based on URL or content_type/media_type
        const url = mediaUrl.toLowerCase();
        const isVideo = url.includes('videos/') || url.includes('video/') ||
                       url.endsWith('.mp4') || url.endsWith('.webm') || 
                       url.endsWith('.mov') || url.includes('/shorts/') ||
                       item?.content_type === 'video' || 
                       item?.media_type === 'video';
        
        setIsVideoContent(isVideo);
        setAccessibleUrl(mediaUrl);
        setEffectiveUrl(mediaUrl);
        
        // If we're already at max retries, don't delay loading
        if (retryCount >= maxRetries) {
          return;
        }
        
        // For small random delay to prevent thundering herd problem
        // This helps when many media items are loaded simultaneously
        if (initialDelay > 0) {
          const randomDelay = Math.floor(Math.random() * initialDelay);
          await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
      } catch (error) {
        console.error("Error determining media source:", error);
        setLoadError(true);
      }
    };
    
    determineMedia();
  }, [item, retryCount, maxRetries, initialDelay]);

  // Handle successful loading
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Handle load errors
  const handleError = useCallback(() => {
    console.error(`Media loading error for ${isVideoContent ? 'video' : 'image'}: ${accessibleUrl}`);
    
    if (retryCount < maxRetries) {
      // Add cache busting and retry with exponential backoff
      const newUrl = addCacheBuster(`${accessibleUrl}`);
      setRetryCount(prev => prev + 1);
      setEffectiveUrl(newUrl);
      return;
    }
    
    setIsLoading(false);
    setLoadError(true);
    if (onError) onError();
  }, [accessibleUrl, isVideoContent, maxRetries, onError, retryCount]);

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setLoadError(false);
    
    // Generate a completely new cache-busted URL
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const baseUrl = accessibleUrl?.split('?')[0] || '';
    const newUrl = `${baseUrl}?cache=${timestamp}-${random}`;
    
    setRetryCount(0); // Reset retry count for new attempt
    setEffectiveUrl(newUrl);
  }, [accessibleUrl]);

  return {
    isLoading,
    loadError,
    retryCount,
    accessibleUrl,
    effectiveUrl,
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  };
};
