
import { useMemo } from 'react';
import { MediaType, MediaSource, MediaOptions } from '@/utils/media/types';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { MediaDisplay } from './MediaDisplay';

interface MediaProps extends MediaOptions {
  /**
   * The media source (URL string or object containing media_url/video_url)
   */
  source: MediaSource | string;
}

/**
 * Universal Media component for displaying images and videos
 */
export const Media = ({
  source,
  className = '',
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  onEnded
}: MediaProps) => {
  // Derive media type and URL from the source
  const { mediaType, mediaUrl } = useMemo(() => {
    // Handle string source
    if (typeof source === 'string') {
      return {
        mediaType: determineMediaType(source),
        mediaUrl: source
      };
    }

    // Handle object source
    const type = determineMediaType(source);
    
    // Extract URL based on determined type
    let url = null;
    if (type === MediaType.VIDEO && source.video_url) {
      url = source.video_url;
    } else if (source.media_url) {
      url = Array.isArray(source.media_url) ? source.media_url[0] : source.media_url;
    }

    return {
      mediaType: type,
      mediaUrl: url
    };
  }, [source]);

  if (!mediaUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 ${className}`}>
        <p>No media available</p>
      </div>
    );
  }

  return (
    <MediaDisplay 
      mediaUrl={mediaUrl}
      mediaType={mediaType}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onEnded={onEnded}
    />
  );
};
