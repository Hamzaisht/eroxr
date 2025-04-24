
import { forwardRef, useState, useEffect, useRef, memo } from 'react';
import { Loader2 } from 'lucide-react';
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
  playbackRate?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const VideoPlayer = memo(forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  url,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  playbackRate = 1,
  objectFit = 'cover',
  onLoad,
  onError,
  onEnded
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

  return (
    <div className={cn('relative overflow-hidden w-full h-full', className)}>
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
