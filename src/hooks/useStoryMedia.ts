import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getPlayableMediaUrl } from "@/utils/media/urlUtils";

interface UseStoryMediaOptions {
  onComplete?: () => void;
  onError?: () => void;
}

export const useStoryMedia = (
  mediaUrl: string | undefined,
  mediaType: 'video' | 'image',
  isPaused: boolean,
  options: UseStoryMediaOptions = {}
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  const { onComplete, onError } = options;
  
  const getPlayableUrl = useCallback((url: string | undefined) => {
    if (!url) return null;
    return getPlayableMediaUrl(url);
  }, []);

  useEffect(() => {
    if (!mediaUrl) {
      setIsLoading(false);
      setHasError(true);
      onError?.();
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    
    const playableUrl = getPlayableUrl(mediaUrl);
    if (playableUrl) {
      setUrl(playableUrl);
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  }, [mediaUrl, getPlayableUrl, onError]);
  
  useEffect(() => {
    if (mediaType === 'video' && url && !isPaused) {
      setIsLoading(false);
    }
  }, [isPaused, mediaType, url]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onComplete?.();
  }, [onComplete]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);
  
  const retryLoad = useCallback(() => {
    if (!mediaUrl) return;
    
    setIsLoading(true);
    setHasError(false);
    
    const playableUrl = getPlayableUrl(mediaUrl);
    if (playableUrl) {
      setUrl(playableUrl);
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  }, [mediaUrl, getPlayableUrl, onError]);

  return {
    url,
    isLoading,
    hasError,
    handleLoad,
    handleError,
    retryLoad
  };
};
