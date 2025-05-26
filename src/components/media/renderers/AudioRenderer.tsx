
import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music, AlertCircle } from "lucide-react";
import { MediaWatermark } from "../MediaWatermark";
import { AccessGate } from "../AccessGate";
import { MediaRendererProps } from "@/utils/media/types";
import { useSecureMediaUrl } from "@/hooks/useSecureMediaUrl";

export const AudioRenderer = ({
  media,
  className = "",
  showWatermark = true,
  autoPlay = false,
  onPlay,
  onPause,
  onError
}: MediaRendererProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { url: secureUrl, isLoading: urlLoading } = useSecureMediaUrl({
    url: media.url,
    accessLevel: media.accessLevel
  });

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        onPlay?.();
      }).catch(() => {
        setHasError(true);
        onError?.();
      });
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (urlLoading) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 p-8 ${className}`}>
        <Music className="w-8 h-8 text-gray-400 animate-pulse" />
      </div>
    );
  }

  if (hasError || !secureUrl) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 p-8 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Failed to load audio</p>
        </div>
      </div>
    );
  }

  return (
    <AccessGate
      creatorId={media.creatorId}
      creatorHandle={media.creatorHandle}
      contentId={media.postId}
      accessLevel={media.accessLevel}
      ppvAmount={media.ppvAmount}
      className={className}
    >
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6">
        <audio
          ref={audioRef}
          src={secureUrl}
          autoPlay={autoPlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Audio Player UI */}
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="p-3 bg-luxury-primary rounded-full hover:bg-luxury-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Progress Bar */}
          <div className="flex-1 space-y-1">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-luxury-primary h-2 rounded-full transition-all duration-300"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <button
            onClick={handleMuteToggle}
            className="p-2 hover:bg-gray-700 rounded"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Watermark */}
        {showWatermark && (
          <MediaWatermark 
            creatorHandle={media.creatorHandle}
            className="bottom-1 right-1"
          />
        )}
      </div>
    </AccessGate>
  );
};
