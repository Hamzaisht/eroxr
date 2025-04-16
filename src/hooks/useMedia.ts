
import { useState, useEffect, useCallback } from 'react';
import { MediaSource, MediaType, MediaResult } from '@/utils/media/types';
import { 
  determineMediaType, 
  extractMediaUrl, 
  getContentType 
} from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

export function useMedia(source: MediaSource | string | null | undefined): MediaResult & {
  retry: () => void;
} {
  const [result, setResult] = useState<MediaResult>({
    url: null,
    type: MediaType.UNKNOWN,
    contentType: 'application/octet-stream',
    isError: false
  });

  const processMedia = useCallback(() => {
    if (!source) {
      setResult({
        url: null,
        type: MediaType.UNKNOWN,
        contentType: 'application/octet-stream',
        isError: false
      });
      return;
    }

    try {
      // Extract URL from source (whether string or object)
      const mediaUrl = typeof source === 'string' 
        ? source 
        : extractMediaUrl(source);

      if (!mediaUrl) {
        setResult({
          url: null,
          type: MediaType.UNKNOWN,
          contentType: 'application/octet-stream',
          isError: true,
          errorMessage: 'No media URL found'
        });
        return;
      }

      // Get playable URL
      const playableUrl = getPlayableMediaUrl(mediaUrl);
      
      // Determine media type and content type
      const mediaType = determineMediaType(source);
      const contentType = getContentType(mediaUrl);

      setResult({
        url: playableUrl,
        type: mediaType,
        contentType,
        isError: false
      });
    } catch (error: any) {
      setResult({
        url: null,
        type: MediaType.UNKNOWN,
        contentType: 'application/octet-stream',
        isError: true,
        errorMessage: error.message || 'Error processing media'
      });
    }
  }, [source]);

  // Process media on mount or when source changes
  useEffect(() => {
    processMedia();
  }, [source, processMedia]);

  return {
    ...result,
    retry: processMedia
  };
}
