
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export type MediaStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'retrying';

interface UseMediaHandlingOptions {
  src: string | null | undefined;
  onLoad?: () => void;
  onError?: () => void;
  maxRetries?: number;
  loadingDelay?: number;
  fallbackSrc?: string;
  logErrors?: boolean;
}

export const useMediaHandling = ({
  src,
  onLoad,
  onError,
  maxRetries = 2,
  loadingDelay = 200,
  fallbackSrc,
  logErrors = true
}: UseMediaHandlingOptions) => {
  const [status, setStatus] = useState<MediaStatus>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null | undefined>(src);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const reset = useCallback(() => {
    setStatus('idle');
    setRetryCount(0);
    setErrorMessage(null);
  }, []);

  const retry = useCallback(() => {
    if (retryCount >= maxRetries) {
      setStatus('error');
      setErrorMessage(`Failed after ${maxRetries} retries`);
      return;
    }

    setStatus('retrying');
    setRetryCount(prev => prev + 1);
    
    // Add cache buster to URL to force reload
    const cacheBuster = `?t=${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const separator = src?.includes('?') ? '&' : '?';
    const retryUrl = src ? `${src}${separator}cb=${cacheBuster}` : null;
    
    setCurrentSrc(retryUrl);
    
    if (logErrors && retryCount === 0) {
      console.info(`Media retry attempt for: ${src?.substring(0, 100)}...`);
    }
  }, [retryCount, maxRetries, src, logErrors]);

  const handleLoad = useCallback(() => {
    setStatus('loaded');
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      retry();
    } else {
      setStatus('error');
      setErrorMessage(`Failed to load media after ${maxRetries} retries`);
      
      if (fallbackSrc && fallbackSrc !== src && fallbackSrc !== currentSrc) {
        setCurrentSrc(fallbackSrc);
        setRetryCount(0);
      } else {
        if (logErrors) {
          console.error(`Media failed to load after ${maxRetries} retries:`, src);
          toast({
            variant: 'destructive',
            title: 'Media Error',
            description: 'Failed to load media content',
          });
        }
        
        if (onError) onError();
      }
    }
  }, [retryCount, maxRetries, src, currentSrc, fallbackSrc, onError, retry, logErrors, toast]);

  // Reset when source changes
  useEffect(() => {
    if (src !== currentSrc && retryCount === 0) {
      setCurrentSrc(src);
      setStatus(src ? 'loading' : 'idle');
      setErrorMessage(null);
    }
  }, [src, currentSrc, retryCount]);

  return {
    status,
    currentSrc,
    retryCount,
    errorMessage,
    handleLoad,
    handleError,
    retry,
    reset,
    isLoading: status === 'loading' || status === 'retrying',
    hasError: status === 'error',
    isLoaded: status === 'loaded',
  };
};
