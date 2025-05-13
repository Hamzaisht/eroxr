
import { useState, useEffect } from 'react';
import { MediaSource, MediaType, MediaOptions } from '@/utils/media/types';
import { MediaRenderer } from './MediaRenderer';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';

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
}

export const UniversalMedia = ({ 
  item, 
  className, 
  showWatermark = false,
  alt = '',
  maxRetries = 1,
  ...props 
}: UniversalMediaProps) => {
  // Determine media type from item if possible
  const [mediaType, setMediaType] = useState<MediaType | undefined>(
    typeof item !== 'string' ? item.media_type : undefined
  );
  
  useEffect(() => {
    // Update media type when item changes
    if (typeof item !== 'string' && item.media_type) {
      setMediaType(item.media_type);
    }
  }, [item]);
  
  // Normalize the media source
  const normalizedSource = normalizeMediaSource(item);

  return (
    <MediaRenderer
      src={normalizedSource}
      type={mediaType}
      className={className}
      maxRetries={maxRetries}
      {...props}
    />
  );
};
