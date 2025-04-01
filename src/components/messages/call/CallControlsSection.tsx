
import { VideoControls } from "./VideoControls";
import { TippingControls } from "./TippingControls";

interface CallControlsSectionProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isGhostMode: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onOpenSettings: () => void;
  onEndCall: () => void;
  recipientId: string;
  onTip: (amount: number) => void;
}

export function CallControlsSection({ 
  isMuted, 
  isVideoOn, 
  isGhostMode, 
  onToggleAudio, 
  onToggleVideo, 
  onOpenSettings, 
  onEndCall,
  recipientId,
  onTip
}: CallControlsSectionProps) {
  return (
    <>
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <VideoControls 
          isMuted={isMuted}
          isVideoOn={isVideoOn}
          onMuteToggle={onToggleAudio}
          onToggleVideo={onToggleVideo}
          onSettings={onOpenSettings}
          onEndCall={onEndCall}
        />
      </div>
      
      {!isGhostMode && (
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <TippingControls 
            recipientId={recipientId} 
            onTip={onTip} 
          />
        </div>
      )}
    </>
  );
}
