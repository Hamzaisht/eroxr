import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  return (
    <div 
      className={cn(
        "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4",
        className
      )}
      role="group"
      aria-label="Video controls"
    >
      <Button
        onClick={onPlayPause}
        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 text-white" />
        ) : (
          <Play className="h-6 w-6 text-white" />
        )}
      </Button>
      
      <Button
        onClick={onMuteToggle}
        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
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