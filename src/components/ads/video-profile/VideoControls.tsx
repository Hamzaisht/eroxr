import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayToggle: () => void;
  onMuteToggle: () => void;
  hasVideo: boolean;
}

export const VideoControls = ({
  isPlaying,
  isMuted,
  onPlayToggle,
  onMuteToggle,
  hasVideo
}: VideoControlsProps) => {
  if (!hasVideo) return null;

  return (
    <div className="absolute top-6 right-6 flex gap-3 z-20">
      <Button
        variant="ghost"
        size="icon"
        className="bg-luxury-dark/50 hover:bg-luxury-dark/70 backdrop-blur-md border border-luxury-primary/20"
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="bg-luxury-dark/50 hover:bg-luxury-dark/70 backdrop-blur-md border border-luxury-primary/20"
        onClick={(e) => {
          e.stopPropagation();
          onPlayToggle();
        }}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
    </div>
  );
};