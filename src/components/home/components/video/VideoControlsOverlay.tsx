
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoControlsOverlayProps {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onToggleMute: () => void;
}

export const VideoControlsOverlay = ({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}: VideoControlsOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
          onClick={onTogglePlay}
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
          onClick={onToggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};
