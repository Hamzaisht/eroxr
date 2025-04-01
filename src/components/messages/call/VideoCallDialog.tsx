
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoControls } from "./VideoControls";
import { VideoSettings } from "./VideoSettings";
import { TippingControls } from "./TippingControls";
import { useTipNotifications } from "./useTipNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useWebRTC } from "./hooks/useWebRTC";
import { useCamera } from "./hooks/useCamera";
import { useMediaTracks } from "./hooks/useMediaTracks";
import type { VideoCallDialogProps } from "./types";
import { useGhostMode } from "@/hooks/useGhostMode";
import { Ghost, AlertTriangle, Camera } from "lucide-react";

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
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideoEnabled);
  const [showSettings, setShowSettings] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const session = useSession();
  const { isGhostMode } = useGhostMode();
  
  // Initialize with default values for frame rate and bitrate
  const frameRate = 30;
  const bitrate = 4000;
  const channelName = `call-${session?.user?.id}-${recipientId}`;
  
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
  
  // Create state for the MediaTracks hook
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(isVideoEnabled);
  
  // Use the hooks correctly
  useMediaTracks(localStream, !audioEnabled, videoEnabled);
  
  // Use the tip notifications hook correctly with proper type
  const { showTipNotification } = useTipNotifications();

  // Helper functions for media controls  
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
      setIsMuted(!audioEnabled);
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
      setIsVideoOff(!videoEnabled);
    }
  };
  
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
  
  const handleToggleAudio = () => {
    toggleAudio();
  };
  
  const handleToggleVideo = () => {
    toggleVideo();
  };
  
  const handleEndCall = () => {
    cleanup();
    onClose();
  };
  
  // Handle tip notification
  const handleSendTip = (amount: number) => {
    showTipNotification(`Sent ${amount} SEK tip`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col p-0 bg-black overflow-hidden">
        {isGhostMode && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white p-4">
            <Ghost className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ghost Mode Active</h3>
            <p className="text-center mb-4">
              You are monitoring this call invisibly. The user cannot see or hear you.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="border-red-500 text-red-500">
                Exit Surveillance
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => showTipNotification('Recording started')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Record Evidence
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full">
          {/* Local video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video 
              ref={localVideoRef}
              autoPlay 
              muted 
              className="w-full h-full object-cover" 
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-300">Camera is off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <div className="px-2 py-1 bg-black/60 rounded-md text-white text-sm">
                You {isMuted && '(Muted)'}
              </div>
            </div>
          </div>
          
          {/* Remote video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video 
              ref={remoteVideoRef}
              autoPlay 
              className="w-full h-full object-cover" 
            />
            {(!remoteStream || isConnecting) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                  <p className="text-gray-300">Waiting for {recipientProfile?.username || 'user'} to join...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <div className="px-2 py-1 bg-black/60 rounded-md text-white text-sm">
                {recipientProfile?.username || 'User'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Video controls */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <VideoControls 
            isMuted={isMuted}
            isVideoOn={!isVideoOff}
            onPlayPause={() => {}} // Not needed for calls
            onMuteToggle={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onSettings={() => setShowSettings(true)}
            onEndCall={handleEndCall}
          />
        </div>
        
        {/* Tipping controls */}
        {!isGhostMode && (
          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <TippingControls 
              recipientId={recipientId} 
              onTip={handleSendTip} 
            />
          </div>
        )}
        
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
