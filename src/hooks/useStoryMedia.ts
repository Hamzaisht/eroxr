
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMedia } from "./useMedia";

interface UseStoryMediaOptions {
  onComplete?: () => void;
  onError?: () => void;
}

/**
 * Hook to handle story media loading
 */
export const useStoryMedia = (
  mediaUrl: string | null,
  mediaType: 'image' | 'video',
  isPaused: boolean,
  { onComplete, onError }: UseStoryMediaOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [localRetryCount, setLocalRetryCount] = useState(0);
  const { toast } = useToast();
  
  // Process the media URL using MediaSource object
  const mediaSource = mediaType === 'image' 
    ? { media_url: mediaUrl }
    : { video_url: mediaUrl };
  
  // Use our media hook
  const { 
    url,
    isError: mediaError,
    retry: retryLoad,
    isLoading
  } = useMedia(mediaSource);
  
  // Handle media load completion
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);
  
  // Handle media load error
  const handleError = useCallback(() => {
    setHasError(true);
    
    if (localRetryCount < 2) {
      setLocalRetryCount(prev => prev + 1);
      retryLoad();
    } else {
      toast({
        title: `Failed to load story ${mediaType}`,
        description: "The media could not be loaded after multiple attempts",
        variant: "destructive"
      });
      
      if (onError) {
        onError();
      }
    }
  }, [localRetryCount, retryLoad, toast, mediaType, onError]);
  
  // Reset state when URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setLocalRetryCount(0);
  }, [mediaUrl]);
  
  return {
    url,
    isLoaded,
    isLoading: isLoading && !isLoaded,
    hasError: hasError || mediaError,
    retryLoad,
    handleLoad,
    handleError
  };
};
