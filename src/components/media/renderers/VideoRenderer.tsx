
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { MediaWatermark } from "../MediaWatermark";
import { AccessGate } from "../AccessGate";
import { MediaRendererProps } from "@/utils/media/types";
import { useSecureMediaUrl } from "@/hooks/useSecureMediaUrl";
import { getPreviewDuration } from "@/utils/media/accessControl";

export const VideoRenderer = ({
  media,
  className = "",
  showWatermark = true,
  showControls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  onPlay,
  onPause,
  onError
}: MediaRendererProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);

  const { url: secureUrl, isLoading: urlLoading } = useSecureMediaUrl({
    url: media.url,
    accessLevel: media.accessLevel
  });

  const previewDuration = getPreviewDuration(media.accessLevel);

  // Handle preview timeout for restricted content
  useEffect(() => {
    if (previewDuration > 0 && isPlaying && !previewEnded) {
      const timeout = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
          setPreviewEnded(true);
        }
      }, previewDuration * 1000);

      return () => clearTimeout(timeout);
    }
  }, [previewDuration, isPlaying, previewEnded]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onPlay?.();
      }).catch(() => {
        setHasError(true);
        onError?.();
      });
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (urlLoading) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 ${className}`}>
        <Play className="w-12 h-12 text-gray-400 animate-pulse" />
      </div>
    );
  }

  if (hasError || !secureUrl) {
    return (
      <div className={`relative flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Failed to load video</p>
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
      <div className="relative w-full h-full bg-black">
        <video
          ref={videoRef}
          src={secureUrl}
          poster={media.thumbnailUrl}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          playsInline
          controls={false}
          onError={handleError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play/Pause Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center group">
            <button
              onClick={handlePlayPause}
              className="p-4 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        )}

        {/* Volume Control */}
        {showControls && (
          <button
            onClick={handleMuteToggle}
            className="absolute bottom-4 left-4 p-2 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        )}

        {/* Watermark */}
        {showWatermark && (
          <MediaWatermark creatorHandle={media.creatorHandle} />
        )}

        {/* Preview Ended Overlay */}
        {previewEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
            <div className="text-center">
              <p className="text-white mb-4">Preview ended</p>
              <p className="text-gray-300 text-sm">Subscribe or purchase to continue watching</p>
            </div>
          </div>
        )}
      </div>
    </AccessGate>
  );
};
