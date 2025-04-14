
import { useState, useEffect, useCallback } from 'react';
import { addCacheBuster, checkUrlAccessibility, fixUrlContentType } from '@/utils/mediaUtils';

interface MediaHandlerOptions {
  item: any; // The data item containing the media URL
  onLoad?: () => void;
  onError?: () => void;
  maxRetries?: number;
}

export const useMediaHandler = ({
  item,
  onLoad,
  onError,
  maxRetries = 2
}: MediaHandlerOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [accessibleUrl, setAccessibleUrl] = useState<string | null>(null);
  const [effectiveUrl, setEffectiveUrl] = useState<string | null>(null);
  const [isVideoContent, setIsVideoContent] = useState(false);

  // Determine the URL to use
  useEffect(() => {
    const determineUrl = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      const mediaUrl = item?.media_url?.[0] || item?.media_url || 
                    item?.video_url || item?.video_urls?.[0] || 
                    item?.url || item?.src || null;
      
      if (!mediaUrl) {
        setAccessibleUrl(null);
        setEffectiveUrl(null);
        setIsLoading(false);
        return;
      }
      
      // Determine if it's a video
      const url = mediaUrl.toLowerCase();
      const isVideo = url.includes('videos/') || url.includes('video/') ||
                     url.endsWith('.mp4') || url.endsWith('.webm') || 
                     url.endsWith('.mov') || url.includes('/shorts/') ||
                     item?.content_type === 'video' || 
                     item?.media_type === 'video';
      
      setIsVideoContent(isVideo);
      
      // Add cache buster to URL
      const urlWithCacheBuster = addCacheBuster(mediaUrl);
      setAccessibleUrl(urlWithCacheBuster);
      setEffectiveUrl(urlWithCacheBuster);
    };
    
    determineUrl();
  }, [item]);

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
      // Try again with a new cache buster
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
    
    setRetryCount(prev => prev + 1);
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
