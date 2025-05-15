
import { useState, useEffect } from 'react';
import { MediaSource, MediaType, MediaOptions } from '@/utils/media/types';
import { MediaRenderer } from './MediaRenderer';
import { normalizeMediaSource } from '@/utils/media/types';
import { extractMediaUrl } from '@/utils/media/urlUtils';

interface UniversalMediaProps extends MediaOptions {
  /**
   * The media item to display
   */
  item: string | MediaSource;
  
  /**
   * Show watermark on media (default: false)
   */
  showWatermark?: boolean;
  
  /**
   * Alt text for image (for accessibility)
   */
  alt?: string;

  /**
   * Maximum number of retries on error
   */
  maxRetries?: number;
  
  /**
   * Object fit style for the media
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const UniversalMedia = ({ 
  item, 
  className, 
  showWatermark = false,
  alt = '',
  maxRetries = 1,
  objectFit = 'cover',
  ...props 
}: UniversalMediaProps) => {
  // Detect media type
  const [mediaType, setMediaType] = useState<MediaType | undefined>(
    typeof item !== 'string' ? item.media_type : undefined
  );
  
  useEffect(() => {
    // Update media type when item changes
    if (typeof item !== 'string' && item.media_type) {
      setMediaType(item.media_type);
    }
  }, [item]);
  
  // Validate and debug incoming media item
  useEffect(() => {
    if (!item) {
      console.warn("UniversalMedia: No media item provided");
      return;
    }
    
    // Debug media item structure
    if (typeof item !== 'string') {
      const url = extractMediaUrl(item);
      if (!url) {
        console.warn("UniversalMedia: Could not extract URL from media item", item);
      }
    }
  }, [item]);
  
  return (
    <MediaRenderer
      src={item}
      type={mediaType}
      className={className}
      maxRetries={maxRetries}
      showWatermark={showWatermark}
      {...props}
    />
  );
};
