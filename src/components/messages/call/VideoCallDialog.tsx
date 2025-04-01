
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoSettings } from "./VideoSettings";
import { useTipNotifications } from "./useTipNotifications";
import { useWebRTC } from "./hooks/useWebRTC";
import { useCamera } from "./hooks/useCamera";
import { useMediaTracks } from "./hooks/useMediaTracks";
import { useCallState } from "./hooks/useCallState";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { CallControlsSection } from "./CallControlsSection";
import { GhostModeOverlay } from "./GhostModeOverlay";
import { useGhostMode } from "@/hooks/useGhostMode";
import type { VideoCallDialogProps } from "./types";

// Add interface for props if not defined in types.ts
interface VideoCallProps extends VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientProfile: any;
  isVideoEnabled: boolean;
}

// Create the component with the VideoCallDialog name
const VideoCallDialog = ({
  isOpen,
  onClose,
  recipientId,
  recipientProfile,
  isVideoEnabled,
}: VideoCallProps) => {
  const session = useSession();
  const { isGhostMode } = useGhostMode();
  
  // Initialize with default values for frame rate and bitrate
  const frameRate = 30;
  const bitrate = 4000;
  const channelName = `call-${session?.user?.id}-${recipientId}`;
  
  // Use the call state hook
  const { 
    isMuted, 
    isVideoOff, 
    showSettings, 
    toggleAudio, 
    toggleVideo, 
    toggleSettings, 
    setShowSettings 
  } = useCallState(!isVideoEnabled);
  
  const {
    localStream,
    isConnecting,
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    initializeCall,
    cleanup
  } = useWebRTC({
    isOpen,
    channelName,
    currentCameraId: '',
    frameRate,
    bitrate
  });
  
  const { 
    availableCameras, 
    currentCameraId, 
    setCurrentCameraId, 
    updateMediaStream 
  } = useCamera();
  
  // Create state for media tracks
  const [audioEnabled, setAudioEnabled] = useState(!isMuted);
  const [videoEnabled, setVideoEnabled] = useState(!isVideoOff);
  
  // Use the media tracks hook
  useMediaTracks(localStream, isMuted, !isVideoOff);
  
  // Use the tip notifications hook
  const { showTipNotification } = useTipNotifications();
  
  // Update audio/video state when toggles change
  useEffect(() => {
    setAudioEnabled(!isMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);
  
  useEffect(() => {
    setVideoEnabled(!isVideoOff);
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff, localStream]);
  
  // Setup call initialization
  useEffect(() => {
    if (isOpen && !isGhostMode) {
      // Start call when dialog opens, unless in ghost mode
      initializeCall();
    }
    
    return () => {
      if (!isGhostMode) {
        cleanup();
      }
    };
  }, [isOpen, initializeCall, cleanup, isGhostMode]);
  
  // Handle camera selection
  const handleCameraSelect = (deviceId: string) => {
    setCurrentCameraId(deviceId);
    if (localStream && peerConnectionRef.current) {
      updateMediaStream(deviceId, localStream, peerConnectionRef.current, frameRate, localVideoRef);
    }
  };
  
  const handleEndCall = () => {
    cleanup();
    onClose();
  };
  
  // Handle tip notification
  const handleSendTip = (amount: number) => {
    showTipNotification(`Sent ${amount} SEK tip`);
  };
  
  // Handle ghost mode record action
  const handleRecordEvidence = () => {
    showTipNotification('Recording started');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col p-0 bg-black overflow-hidden">
        <GhostModeOverlay 
          isActive={isGhostMode} 
          onExit={onClose} 
          onRecord={handleRecordEvidence} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full">
          {/* Local video */}
          <LocalVideo 
            videoRef={localVideoRef}
            isVideoOff={isVideoOff}
            isMuted={isMuted}
          />
          
          {/* Remote video */}
          <RemoteVideo 
            videoRef={remoteVideoRef}
            isConnecting={isConnecting}
            remoteStream={null} // The hook doesn't provide this directly
            recipientUsername={recipientProfile?.username}
          />
        </div>
        
        {/* Call controls section */}
        <CallControlsSection 
          isMuted={isMuted}
          isVideoOn={!isVideoOff}
          isGhostMode={isGhostMode}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onOpenSettings={() => setShowSettings(true)}
          onEndCall={handleEndCall}
          recipientId={recipientId}
          onTip={handleSendTip}
        />
        
        {/* Settings dialog */}
        {showSettings && (
          <VideoSettings 
            onCameraSwitch={() => {}} // Placeholder
            onFrameRateChange={() => {}} // Placeholder
            onBitrateChange={() => {}} // Placeholder
            availableCameras={availableCameras}
            currentCamera={currentCameraId}
            onCameraSelect={handleCameraSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Export the component
export { VideoCallDialog };
