
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (on: boolean) => void;
  isVideoEnabled: boolean;
}

export function VideoControls({
  isMuted,
  setIsMuted,
  isVideoOn,
  setIsVideoOn,
  isVideoEnabled,
}: VideoControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className={`rounded-full transition-all duration-300 hover:scale-110 ${
          isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'hover:bg-luxury-primary/20'
        }`}
      >
        {isMuted ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {isVideoEnabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`rounded-full transition-all duration-300 hover:scale-110 ${
            !isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'hover:bg-luxury-primary/20'
          }`}
        >
          {isVideoOn ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
}
