
import { useState, useEffect } from 'react';

interface UseMediaHandlingOptions {
  src: string | null | undefined;
  fallbackSrc?: string | null;
  maxRetries?: number;
  onLoad?: () => void;
  onError?: () => void;
}

interface UseMediaHandlingReturn {
  currentSrc: string | null;
  status: 'loading' | 'loaded' | 'error';
  handleLoad: () => void;
  handleError: () => void;
  retry: () => void;
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
}

export function useMediaHandling({
  src,
  fallbackSrc,
  maxRetries = 2,
  onLoad,
  onError
}: UseMediaHandlingOptions): UseMediaHandlingReturn {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error'
  );
  const [retryCount, setRetryCount] = useState(0);
  const isLoading = status === 'loading';
  const hasError = status === 'error';

  // Update source when props change
  useEffect(() => {
    if (src !== undefined && src !== null) {
      setCurrentSrc(src);
      setStatus('loading');
      setRetryCount(0);
    } else if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setStatus('loading');
      setRetryCount(0);
    } else {
      setCurrentSrc(null);
      setStatus('error');
    }
  }, [src, fallbackSrc]);

  // Handle successful load
  const handleLoad = () => {
    setStatus('loaded');
    if (onLoad) onLoad();
  };

  // Handle load error
  const handleError = () => {
    // Try fallback if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setStatus('loading');
      return;
    }

    // Handle error state
    setStatus('error');
    if (onError) onError();
  };

  // Retry loading the original source
  const retry = () => {
    if (retryCount < maxRetries) {
      // Add cache buster to url
      const cacheBuster = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const urlWithCacheBuster = src 
        ? src + (src.includes('?') ? '&' : '?') + `cb=${cacheBuster}`
        : null;
        
      setCurrentSrc(urlWithCacheBuster);
      setStatus('loading');
      setRetryCount(prev => prev + 1);
    }
  };

  return {
    currentSrc,
    status,
    handleLoad,
    handleError,
    retry,
    isLoading,
    hasError,
    retryCount
  };
}
