
import { forwardRef, Ref, useMemo } from 'react';
import { SimpleMediaRenderer } from './SimpleMediaRenderer';
import { MediaSource, MediaType, MediaAccessLevel } from '@/utils/media/types';
import { normalizeMediaSource } from '@/utils/media/mediaUtils';
import { isValidMediaUrl } from '@/utils/media/mediaOrchestrator';
import { AlertCircle } from 'lucide-react';

interface UniversalMediaProps {
  item: any;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  showWatermark?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: (error?: any) => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  maxRetries?: number;
  accessLevel?: MediaAccessLevel;
  compact?: boolean;
}

export const UniversalMedia = forwardRef(({
  item,
  className = "",
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  poster,
  onClick,
  onLoad,
  onError,
  compact = false
}: UniversalMediaProps, ref: Ref<HTMLVideoElement | HTMLImageElement>) => {
  
  // Process the item to ensure it has a url property
  const mediaItem = useMemo(() => {
    try {
      return normalizeMediaSource(item);
    } catch (error) {
      console.error("Error normalizing media source:", error, item);
      return { url: '', type: MediaType.UNKNOWN };
    }
  }, [item]);
  
  // Early validation of URL
  if (!isValidMediaUrl(mediaItem?.url)) {
    if (compact) {
      return (
        <div className="flex items-center justify-center h-32 w-full bg-luxury-darker/50 rounded-lg border border-luxury-neutral/10">
          <div className="text-center p-4">
            <AlertCircle className="h-6 w-6 text-luxury-neutral/50 mx-auto mb-2" />
            <p className="text-xs text-luxury-neutral/70">Media not available</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-200">Invalid media source</p>
      </div>
    );
  }

  // Determine media type
  const isVideo = mediaItem.type === MediaType.VIDEO || 
                  mediaItem.url.match(/\.(mp4|webm|mov|avi)($|\?)/i);
  
  return (
    <SimpleMediaRenderer
      url={mediaItem.url}
      type={isVideo ? 'video' : 'image'}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      poster={poster}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      compact={compact}
    />
  );
});

UniversalMedia.displayName = 'UniversalMedia';
