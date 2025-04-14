
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onClick?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
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
  onClick,
  onError,
  onEnded,
  onLoadedData,
  creatorId
}: VideoPlayerProps) => {
  const {
    videoRef,
    isPlaying,
    isLoading,
    hasError,
    isStalled,
    processedUrl,
    handleRetry
  } = useMediaPlayer({
    url,
    poster,
    autoPlay,
    muted,
    loop,
    onError,
    onEnded,
    onLoadedData
  });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      
      {isStalled && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
            <p className="text-white/80 text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-white/80 text-sm mb-3">Failed to load video</p>
          <button
            onClick={handleRetry}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md"
          >
            <RefreshCw className="h-4 w-4 text-white" />
            <span className="text-white text-sm">Retry</span>
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src={processedUrl || undefined}
        className="w-full h-full object-contain"
        controls={controls}
        poster={poster}
        playsInline
        muted={muted}
        loop={loop}
        onClick={onClick}
      />
    </div>
  );
};
