
import { useState, useEffect } from 'react';
import { MediaAccessLevel } from '@/utils/media/types';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface UseSecureMediaUrlProps {
  url: string;
  accessLevel: MediaAccessLevel;
}

export const useSecureMediaUrl = ({ url, accessLevel }: UseSecureMediaUrlProps) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processUrl = async () => {
      try {
        // For now, just use the playable URL utility
        // In the future, this could generate signed URLs for private content
        const processedUrl = getPlayableMediaUrl(url);
        setSecureUrl(processedUrl);
      } catch (error) {
        console.error('Error processing media URL:', error);
        setSecureUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      processUrl();
    } else {
      setIsLoading(false);
    }
  }, [url, accessLevel]);

  return { url: secureUrl, isLoading };
};
