
import { forwardRef, Ref, useMemo } from 'react';
import { SimpleMediaRenderer } from './SimpleMediaRenderer';
import { MediaType } from '@/utils/media/types';
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
  
  // Extract URL from various possible formats
  const mediaUrl = useMemo(() => {
    if (!item) return '';
    
    // If item is a string, use it directly
    if (typeof item === 'string') return item;
    
    // If item is an object, try various URL properties
    if (typeof item === 'object') {
      return item.url || 
             item.media_url || 
             item.video_url || 
             item.thumbnail_url || 
             (Array.isArray(item.media_url) ? item.media_url[0] : '') ||
             '';
    }
    
    return '';
  }, [item]);

  // Determine if it's a video based on URL or type
  const isVideo = useMemo(() => {
    if (!mediaUrl) return false;
    
    // Check item type first
    if (item?.type === MediaType.VIDEO) return true;
    
    // Check URL extension
    return /\.(mp4|webm|mov|avi|m4v|3gp|flv|mkv|wmv)($|\?)/i.test(mediaUrl);
  }, [mediaUrl, item]);

  // Early validation
  if (!isValidMediaUrl(mediaUrl)) {
    if (compact) {
      return (
        <div className="flex items-center justify-center h-32 w-full bg-luxury-darker/50 rounded-lg border border-luxury-neutral/10">
          <div className="text-center p-4">
            <AlertCircle className="h-6 w-6 text-luxury-neutral/50 mx-auto mb-2" />
            <p className="text-xs text-luxury-neutral/70">No media</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-black/10 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm text-gray-200">No media available</p>
      </div>
    );
  }

  return (
    <SimpleMediaRenderer
      url={mediaUrl}
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
