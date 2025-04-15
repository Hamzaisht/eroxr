
import { useRef } from 'react';
import { Loader2, RefreshCw, AlertCircle, X, Volume2, VolumeX } from 'lucide-react';
import { VideoErrorState } from './VideoErrorState';
import { VideoLoadingState } from './VideoLoadingState';
import { useMedia } from '@/hooks/useMedia';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playOnHover?: boolean;
  showCloseButton?: boolean;
  onClick?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  onClose?: () => void;
  creatorId?: string;
}

export const VideoPlayer = ({
  url,
  poster,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = true,
  playOnHover = false,
  showCloseButton = false,
  onClick,
  onError,
  onEnded,
  onLoadedData,
  onClose,
  creatorId
}: VideoPlayerProps) => {
  // Use our media hook to handle media URL processing
  const { url: processedUrl, isLoading: mediaLoading, isError, retry, retryCount } = 
    useMedia(url, { autoLoad: true });
  
  // Use our video player hook for video functionality
  const {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    togglePlay,
    toggleMute,
  } = useVideoPlayer({
    url: processedUrl,
    autoPlay,
    muted,
    loop,
    onError,
    onEnded,
    onLoadedData
  });
  
  // Handle playOnHover functionality
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle play on hover if needed
  if (playOnHover && containerRef.current) {
    containerRef.current.onmouseenter = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch(console.error);
      }
    };
    
    containerRef.current.onmouseleave = () => {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
    };
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading state */}
      {(mediaLoading || isBuffering) && (
        <VideoLoadingState 
          isStalled={isBuffering} 
          onRetry={() => retry()} 
        />
      )}
      
      {/* Error state */}
      {isError && (
        <VideoErrorState 
          message="Failed to load video" 
          onRetry={() => retry()} 
        />
      )}
      
      {/* Close button */}
      {showCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Volume control - only show if video is playing */}
      {!isError && !mediaLoading && controls && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={processedUrl || undefined}
        className="w-full h-full object-contain"
        controls={controls}
        poster={poster}
        playsInline
        muted={isMuted}
        loop={loop}
        onClick={onClick || togglePlay}
      />
      
      {/* Debug info in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-white/70 px-2 py-0.5">
          Status: {mediaLoading ? 'loading' : isError ? 'error' : isPlaying ? 'playing' : 'paused'}
        </div>
      )}
    </div>
  );
};
