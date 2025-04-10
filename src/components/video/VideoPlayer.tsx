
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  onError?: () => void;
  creatorId?: string;
}

export const VideoPlayer = ({ 
  url, 
  poster,
  className,
  autoPlay = false,
  onError,
  creatorId
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [watermarkUsername, setWatermarkUsername] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Process URL with our utility
  const processedUrl = getPlayableMediaUrl({media_url: url});
  const processedPoster = poster ? getPlayableMediaUrl({media_url: poster}) : undefined;
  
  useEffect(() => {
    if (creatorId) {
      getUsernameForWatermark(creatorId)
        .then(username => setWatermarkUsername(username))
        .catch(err => console.error("Error getting watermark username:", err));
    }
  }, [creatorId]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    if (!processedUrl) {
      setError(true);
      setIsLoading(false);
      if (onError) onError();
      return;
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        video.play().catch(err => {
          console.warn("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      }
    };
    
    const handleError = () => {
      console.error("Video error:", processedUrl);
      setError(true);
      setIsLoading(false);
      if (onError) onError();
    };
    
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [processedUrl, autoPlay, onError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white/80">Failed to load video</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={processedUrl || undefined}
          poster={processedPoster}
          className="w-full h-full object-cover"
          playsInline
          loop
          muted={isMuted}
          onClick={togglePlay}
        />
      )}
      
      {!error && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
      
      {!error && !isLoading && watermarkUsername && (
        <div className="absolute bottom-2 right-2 text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
          @{watermarkUsername}
        </div>
      )}
    </div>
  );
};
