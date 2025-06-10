
import { useState, useEffect, useCallback } from 'react';
import { getValidMediaUrl, validateMediaUrl } from '@/utils/media/mediaUtils';

interface UseValidMediaUrlResult {
  url: string | null;
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

export const useValidMediaUrl = (storagePath: string): UseValidMediaUrlResult => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>();

  const loadMedia = useCallback(async () => {
    if (!storagePath) {
      setUrl(null);
      setIsLoading(false);
      setIsError(true);
      setError('No storage path provided');
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(undefined);

      const mediaUrl = getValidMediaUrl(storagePath);
      
      if (!mediaUrl) {
        throw new Error('Failed to generate media URL');
      }

      // Skip validation for performance - just return the URL
      setUrl(mediaUrl);
    } catch (err: any) {
      console.error('useValidMediaUrl - Error loading media:', err);
      setIsError(true);
      setError(err.message || 'Failed to load media');
      setUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [storagePath]);

  useEffect(() => {
    if (storagePath) {
      loadMedia();
    } else {
      setUrl(null);
      setIsLoading(false);
      setIsError(true);
      setError('No storage path provided');
    }
  }, [storagePath, loadMedia]);

  return { url, isLoading, isError, error };
};
