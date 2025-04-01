
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { usePreventFormSubmission } from "@/hooks/use-prevent-form-submission";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  className?: string;
}

export const VideoControls = ({
  isPlaying,
  isMuted,
  onPlayPause,
  onMuteToggle,
  className
}: VideoControlsProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { preventFormSubmission } = usePreventFormSubmission();
  
  return (
    <div 
      className={cn(
        "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4",
        isTablet && "opacity-100", // Always show controls on mobile/tablet
        className
      )}
      role="group"
      aria-label="Video controls"
      onClick={(e) => {
        e.stopPropagation();
        preventFormSubmission(e);
      }}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPlayPause();
        }}
        className={cn(
          "p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm",
          isMobile && "scale-75"
        )}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 text-white" />
        ) : (
          <Play className="h-6 w-6 text-white" />
        )}
      </Button>
      
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMuteToggle();
        }}
        className={cn(
          "p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm",
          isMobile && "scale-75"
        )}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6 text-white" />
        ) : (
          <Volume2 className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};
