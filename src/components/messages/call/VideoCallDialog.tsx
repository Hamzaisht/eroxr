
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

export function VideoCallDialog({
  isOpen,
  onClose,
  recipientId,
  recipientProfile,
  isVideoEnabled = true,
}: VideoCallDialogProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideoEnabled);
  const [frameRate, setFrameRate] = useState(30);
  const [bitrate, setBitrate] = useState(4000);
  
  const session = useSession();
  const channelName = `call:${session?.user?.id}:${recipientId}`;
  
  const { 
    availableCameras, 
    currentCameraId, 
    setCurrentCameraId, 
    updateMediaStream 
  } = useCamera();

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
    currentCameraId,
    frameRate,
    bitrate
  });

  useMediaTracks(localStream, isMuted, isVideoOn);
  useTipNotifications(recipientId);

  useEffect(() => {
    if (!isOpen) return;
    
    const channel = supabase.channel(channelName)
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!peerConnectionRef.current) return;
        
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        channel.send({
          type: 'broadcast',
          event: 'answer',
          payload: { answer }
        });
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
      })
      .on('broadcast', { event: 'ice_candidate' }, async ({ payload }) => {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      })
      .subscribe();

    initializeCall();

    return () => {
      cleanup();
      supabase.removeChannel(channel);
    };
  }, [isOpen, channelName]);

  const handleCameraSwitch = async () => {
    if (!availableCameras.length) return;
    
    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    
    setCurrentCameraId(nextCamera.deviceId);
    await updateMediaStream(
      nextCamera.deviceId,
      localStream,
      peerConnectionRef.current,
      frameRate,
      localVideoRef
    );
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-b from-luxury-dark to-black p-0 border-luxury-primary/20">
        <div className="relative video-container h-[600px] rounded-lg overflow-hidden">
          <div className="relative w-full h-full">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin mx-auto"/>
                  <p className="text-luxury-primary font-medium">Connecting...</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 w-48 h-32 transition-transform hover:scale-105">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover rounded-lg border border-luxury-primary/20 shadow-luxury"
              autoPlay
              muted
              playsInline
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <VideoControls
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  isVideoOn={isVideoOn}
                  setIsVideoOn={setIsVideoOn}
                  isVideoEnabled={isVideoEnabled}
                />
                <VideoSettings
                  onCameraSwitch={handleCameraSwitch}
                  onFrameRateChange={setFrameRate}
                  onBitrateChange={setBitrate}
                  availableCameras={availableCameras}
                  currentCamera={currentCameraId}
                  onCameraSelect={setCurrentCameraId}
                />
              </div>

              <div className="flex items-center gap-4">
                <TippingControls
                  recipientId={recipientId}
                  channelName={channelName}
                />
                
                <Button 
                  variant="destructive" 
                  onClick={handleClose}
                  className="hover:bg-red-600 transition-colors"
                >
                  End Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
