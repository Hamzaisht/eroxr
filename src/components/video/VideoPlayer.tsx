import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className,
  onError 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      console.log("Video loaded successfully:", url);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      if (onError) onError();
      toast({
        title: "Error",
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      });
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
  }, [url, onError, toast]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
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
    <div className={cn(
      "relative group aspect-video w-full overflow-hidden rounded-lg bg-luxury-darker/50",
      className
    )}>
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
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