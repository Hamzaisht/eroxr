import { useState, useRef, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { MediaType, MediaSource } from "@/utils/media/types";
import { extractMediaUrl, normalizeMediaSource } from '@/utils/media/mediaUtils';

interface ErosVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onError?: () => void;
  onVideoEnd?: () => void;
}

export function ErosVideoPlayer({
  videoUrl,
  thumbnailUrl,
  isActive,
  autoPlay = true,
  loop = true,
  muted = true,
  className = "",
  onError,
  onVideoEnd
}: ErosVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [loadError, setLoadError] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  
  // Validate video URL
  useEffect(() => {
    if (!videoUrl) {
      console.warn("ErosVideoPlayer: No video URL provided");
    }
  }, [videoUrl]);
  
  const shouldPlay = isActive && inView;
  
  // Create a properly normalized media source
  const videoSource = useMemo(() => normalizeMediaSource({
    url: videoUrl,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    media_type: MediaType.VIDEO,
  }), [videoUrl, thumbnailUrl]);
  
  const handleError = () => {
    console.error("ErosVideoPlayer error:", videoUrl);
    setLoadError(true);
    if (onError) onError();
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    if (onVideoEnd) onVideoEnd();
  };

  // Check if we have a valid URL
  const hasValidUrl = !!extractMediaUrl(videoSource);
  
  if (!hasValidUrl) {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center bg-black/50", className)}>
        <p className="text-gray-300">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <div ref={ref} className={cn("relative w-full h-full overflow-hidden", className)}>
      <MediaRenderer
        src={videoSource}
        type={MediaType.VIDEO}
        className="w-full h-full object-cover"
        poster={thumbnailUrl}
        autoPlay={shouldPlay}
        controls={false}
        muted={isMuted}
        loop={loop}
        onError={handleError}
        onEnded={handleEnded}
        allowRetry={true}
        maxRetries={1}
      />
      
      {!loadError && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors z-10"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>
      )}
    </div>
  );
}
