
import { useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, VolumeX, Volume2 } from 'lucide-react';
import { MediaType } from '@/utils/media/mediaUtils';
import { useMedia } from '@/hooks/useMedia';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface MediaDisplayProps {
  mediaUrl: string | null;
  mediaType: MediaType;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const MediaDisplay = ({
  mediaUrl,
  mediaType,
  className = '',
  poster,
  autoPlay = false,
  controls = true,
  muted = true,
  loop = false,
  onClick,
  onLoad,
  onError,
  onEnded
}: MediaDisplayProps) => {
  const [hasManuallyRetried, setHasManuallyRetried] = useState(false);

  // Use our media hook to handle URL processing
  const {
    url: processedUrl,
    isLoading,
    isError,
    retry
  } = useMedia(mediaUrl, {
    autoLoad: true,
    maxRetries: hasManuallyRetried ? 3 : 1
  });

  // Use our video player hook for video-specific functionality
  const {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    togglePlay,
    toggleMute,
    hasError: videoError
  } = useVideoPlayer({
    url: mediaType === MediaType.VIDEO ? processedUrl : null,
    autoPlay,
    muted,
    loop,
    onLoadedData: onLoad,
    onError,
    onEnded
  });

  const handleRetry = () => {
    setHasManuallyRetried(true);
    retry();
  };

  // Loading state
  if (isLoading || isBuffering) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state
  if (isError || videoError || !processedUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 ${className}`}>
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm">Failed to load media</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  // Render video element
  if (mediaType === MediaType.VIDEO) {
    return (
      <div className="relative">
        <video
          ref={videoRef}
          src={processedUrl}
          className={className}
          poster={poster}
          controls={controls}
          loop={loop}
          playsInline
          onClick={onClick || togglePlay}
        />
        
        {!controls && (
          <button
            onClick={toggleMute}
            className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
  }

  // Render image element
  return (
    <img
      src={processedUrl}
      className={className}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      alt="Media content"
    />
  );
};
