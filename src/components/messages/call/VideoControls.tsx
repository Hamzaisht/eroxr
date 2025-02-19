
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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
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
