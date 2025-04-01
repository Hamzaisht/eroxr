
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
  const { isGhostMode } = useGhostMode();
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
    
    // If in ghost mode, log the surveillance
    if (isGhostMode && session?.user?.id) {
      supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_view_call',
        details: {
          call_channel: channelName,
          recipient_id: recipientId,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    const channel = supabase.channel(channelName)
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!peerConnectionRef.current) return;
        
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        // Only send answer if not in ghost mode
        if (!isGhostMode) {
          channel.send({
            type: 'broadcast',
            event: 'answer',
            payload: { answer }
          });
        }
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

    // Only initialize our side of the call if not in ghost mode
    if (!isGhostMode) {
      initializeCall();
    }

    return () => {
      cleanup();
      supabase.removeChannel(channel);
    };
  }, [isOpen, channelName, isGhostMode]);

  const handleCameraSwitch = async () => {
    if (!availableCameras.length || isGhostMode) return;
    
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
  
  const captureScreenshot = async () => {
    if (!remoteVideoRef.current || !session?.user?.id) return;
    
    try {
      // Create a canvas element to capture the video frame
      const canvas = document.createElement('canvas');
      canvas.width = remoteVideoRef.current.videoWidth;
      canvas.height = remoteVideoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Draw the current video frame onto the canvas
      ctx.drawImage(remoteVideoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to a data URL (JPEG format, 90% quality)
      const screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Log the screenshot action for audit purposes
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_call_screenshot',
        details: {
          call_channel: channelName,
          recipient_id: recipientId,
          timestamp: new Date().toISOString(),
          screenshot_taken: true
        }
      });
      
      // Download the screenshot
      const link = document.createElement('a');
      link.href = screenshotDataUrl;
      link.download = `call-${recipientId}-${new Date().toISOString()}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  
  const reportCall = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Create a report in the database
      await supabase.from('admin_alerts').insert({
        type: 'flag',
        user_id: session.user.id,
        content_type: 'call',
        content_id: channelName,
        reason: 'Call flagged by admin',
        severity: 'high'
      });
      
      // Log the report action for audit purposes
      await supabase.from('admin_audit_logs').insert({
        user_id: session.user.id,
        action: 'ghost_call_flagged',
        details: {
          call_channel: channelName,
          recipient_id: recipientId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error reporting call:', error);
    }
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
            {isConnecting && !isGhostMode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-luxury-primary border-t-transparent rounded-full animate-spin mx-auto"/>
                  <p className="text-luxury-primary font-medium">Connecting...</p>
                </div>
              </div>
            )}
            
            {isGhostMode && (
              <div className="absolute top-4 left-4 bg-purple-900/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
                <Ghost className="h-3.5 w-3.5 text-purple-400" />
                <span>Ghost Monitoring - Invisible to Users</span>
              </div>
            )}
          </div>

          {!isGhostMode && (
            <div className="absolute bottom-4 right-4 w-48 h-32 transition-transform hover:scale-105">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover rounded-lg border border-luxury-primary/20 shadow-luxury"
                autoPlay
                muted
                playsInline
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {!isGhostMode ? (
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
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-black/50 hover:bg-black/70 text-white"
                    onClick={captureScreenshot}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Screenshot
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-red-900/50 hover:bg-red-900/70 text-white"
                    onClick={reportCall}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-4">
                {!isGhostMode && (
                  <TippingControls
                    recipientId={recipientId}
                    channelName={channelName}
                  />
                )}
                
                <Button 
                  variant="destructive" 
                  onClick={handleClose}
                  className="hover:bg-red-600 transition-colors"
                >
                  {isGhostMode ? "Exit Monitoring" : "End Call"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
