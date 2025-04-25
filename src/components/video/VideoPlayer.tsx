
import { forwardRef, useState, useEffect, useRef, memo } from 'react';
import { Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playOnHover?: boolean;
  playbackRate?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showCloseButton?: boolean;
  creatorId?: string;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onClick?: () => void;
  onClose?: () => void;
}

export const VideoPlayer = memo(forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  url,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  playOnHover = false,
  playbackRate = 1,
  objectFit = 'cover',
  showCloseButton = false,
  creatorId,
  onLoad,
  onError,
  onEnded,
  onClick,
  onClose
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  // Handle video loading
  useEffect(() => {
    const video = ref ? (ref as React.MutableRefObject<HTMLVideoElement>).current : videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setCanPlay(true);
      onLoad?.();
    };

    const handleError = (e: any) => {
      console.error('Video loading error:', e);
      setIsLoading(false);
      setError(new Error('Failed to load video'));
      onError?.();
    };

    const handleEnded = () => {
      onEnded?.();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Set playback rate when changed
    if (video.playbackRate !== playbackRate) {
      video.playbackRate = playbackRate;
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [ref, videoRef, onLoad, onError, onEnded, playbackRate]);
  
  // Handle play on hover if enabled
  useEffect(() => {
    if (!playOnHover) return;
    
    const video = ref ? (ref as React.MutableRefObject<HTMLVideoElement>).current : videoRef.current;
    if (!video) return;
    
    const handleMouseEnter = () => {
      if (video.paused && canPlay) {
        video.play().catch(err => console.log('Could not autoplay on hover:', err));
      }
    };
    
    const handleMouseLeave = () => {
      if (!video.paused) {
        video.pause();
      }
    };
    
    const container = video.parentElement;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [playOnHover, ref, videoRef, canPlay]);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={cn('relative overflow-hidden w-full h-full', className)}
      onClick={handleClick}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10">
          <p className="text-white text-sm">Failed to load video</p>
        </div>
      )}
      
      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}
      
      {/* Video element */}
      <motion.video
        ref={ref || videoRef}
        src={url}
        className={cn('w-full h-full', objectFit === 'cover' && 'object-cover')}
        style={{ objectFit }}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload="metadata"
        initial={{ opacity: 0 }}
        animate={{ opacity: canPlay ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}));

VideoPlayer.displayName = 'VideoPlayer';
