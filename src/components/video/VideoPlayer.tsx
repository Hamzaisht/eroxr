
import { useRef } from 'react';
import { Loader2, RefreshCw, AlertCircle, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMedia } from '@/hooks/useMedia';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface VideoErrorStateProps {
  message: string;
  onRetry: () => void;
}

const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => (
  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
    <p className="text-white text-center mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 rounded-md bg-luxury-primary text-white flex items-center"
    >
      <RefreshCw className="w-4 h-4 mr-2" /> Retry
    </button>
  </div>
);

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

const VideoLoadingState = ({ isStalled, onRetry }: VideoLoadingStateProps) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
    {isStalled ? (
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-luxury-primary animate-spin mb-2" />
        <p className="text-white text-sm">Loading taking too long...</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 px-3 py-1 rounded text-xs bg-luxury-primary text-white flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Retry
          </button>
        )}
      </div>
    ) : (
      <Loader2 className="h-8 w-8 text-luxury-primary animate-spin" />
    )}
  </div>
);

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
  muted = true,
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
  const { url: processedUrl, isLoading: mediaLoading, isError, retry } = 
    useMedia({ video_url: url });
  
  // Use our video player hook for video functionality
  const {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    hasError,
    togglePlay,
    toggleMute,
  } = useVideoPlayer({
    url: processedUrl || '',
    autoPlay,
    muted,
    loop,
    onError,
    onEnded,
    onLoadedData
  });
  
  // Container for handling hover events
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
      {(isError || hasError) && (
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
        className={cn("w-full h-full object-contain", className)}
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
