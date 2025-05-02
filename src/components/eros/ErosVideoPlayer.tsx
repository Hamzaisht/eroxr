
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { MediaType } from "@/utils/media/types";
import { reportMediaError } from "@/utils/media/mediaMonitoring";

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
  
  const shouldPlay = isActive && inView;
  
  const handleError = () => {
    setLoadError(true);
    
    reportMediaError(
      videoUrl,
      'load_failure',
      0,
      'video',
      'ErosVideoPlayer'
    );
    
    if (onError) onError();
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    if (onVideoEnd) onVideoEnd();
  };
  
  return (
    <div ref={ref} className={cn("relative w-full h-full overflow-hidden", className)}>
      <MediaRenderer
        src={{
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          media_type: MediaType.VIDEO
        }}
        className="w-full h-full object-cover"
        poster={thumbnailUrl}
        autoPlay={shouldPlay}
        controls={false}
        muted={isMuted}
        loop={loop}
        onError={handleError}
        onEnded={handleEnded}
      />
      
      {!loadError && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
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
