import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
}

export const VideoPlayer = ({ url, poster, className, onError }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Loading video URL:', url);

    const handleLoadedData = () => {
      setIsLoaded(true);
      console.log("Video loaded successfully:", url);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      if (onError) onError();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Reset video state when URL changes
    setIsPlaying(false);
    setIsLoaded(false);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [url, onError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn("relative group", className)}>
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        crossOrigin="anonymous"
        className="w-full h-full object-cover rounded-lg"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};