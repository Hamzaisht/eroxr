
import { 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  Settings, 
  Video, 
  VideoOff 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VideoControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onPlayPause?: () => void;
  onMuteToggle: () => void;
  onToggleVideo: () => void;
  onSettings?: () => void;
  onEndCall: () => void;
}

export const VideoControls = ({
  isMuted,
  isVideoOn,
  onMuteToggle,
  onToggleVideo,
  onSettings,
  onEndCall
}: VideoControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-4">
      {/* Audio toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20"
        onClick={onMuteToggle}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-red-400" />
        ) : (
          <Volume2 className="h-5 w-5 text-white" />
        )}
      </Button>
      
      {/* Video toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20"
        onClick={onToggleVideo}
      >
        {!isVideoOn ? (
          <VideoOff className="h-5 w-5 text-red-400" />
        ) : (
          <Video className="h-5 w-5 text-white" />
        )}
      </Button>
      
      {/* Settings */}
      {onSettings && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20"
          onClick={onSettings}
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
      )}
      
      {/* End call */}
      <Button
        variant="destructive"
        size="icon"
        className="rounded-full"
        onClick={onEndCall}
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};
