
import { useState, useRef, useEffect, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { MediaType } from "@/utils/media/types";
import { reportMediaError } from "@/utils/media/mediaMonitoring";
import { mediaOrchestrator } from "@/utils/media/mediaOrchestrator";

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
  
  // Create a stable media source reference
  const videoSource = useMemo(() => ({
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    media_type: MediaType.VIDEO,
  }), [videoUrl, thumbnailUrl]);
  
  // Register the video with our orchestrator when it becomes active
  useEffect(() => {
    if (isActive && videoSource) {
      mediaOrchestrator.registerMediaRequest(videoSource);
    }
  }, [isActive, videoSource]);
  
  const handleError = () => {
    console.error("ErosVideoPlayer error:", videoUrl);
    setLoadError(true);
    
    try {
      reportMediaError(
        videoUrl,
        'load_failure',
        0,
        'video',
        'ErosVideoPlayer'
      );
    } catch (error) {
      console.error("Error reporting media error:", error);
    }
    
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
