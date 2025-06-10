
import { useState, useEffect } from 'react';
import { getValidMediaUrl, validateMediaUrl } from '@/utils/media/mediaUtils';

interface UseValidMediaUrlResult {
  url: string | null;
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

export const useValidMediaUrl = (storagePath: string): UseValidMediaUrlResult => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!storagePath) {
      setUrl(null);
      setIsLoading(false);
      setIsError(true);
      setError('No storage path provided');
      return;
    }

    const loadMedia = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(undefined);

        const mediaUrl = getValidMediaUrl(storagePath);
        
        if (!mediaUrl) {
          throw new Error('Failed to generate media URL');
        }

        // Validate URL accessibility
        const isValid = await validateMediaUrl(mediaUrl);
        
        if (!isValid) {
          throw new Error('Media URL is not accessible');
        }

        setUrl(mediaUrl);
      } catch (err: any) {
        console.error('useValidMediaUrl - Error loading media:', err);
        setIsError(true);
        setError(err.message || 'Failed to load media');
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [storagePath]);

  return { url, isLoading, isError, error };
};
