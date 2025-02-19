
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoControls } from "./VideoControls";
import { VideoSettings } from "./VideoSettings";
import { TippingControls } from "./TippingControls";
import { useTipNotifications } from "./useTipNotifications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string>('');
  const [frameRate, setFrameRate] = useState(30);
  const [bitrate, setBitrate] = useState(4000);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const channelName = `call:${session?.user?.id}:${recipientId}`;
  
  useTipNotifications(recipientId);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setCurrentCameraId(cameras[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };

    getCameras();
  }, []);

  const handleCameraSwitch = async () => {
    if (!availableCameras.length) return;
    
    const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    
    setCurrentCameraId(nextCamera.deviceId);
    await updateMediaStream(nextCamera.deviceId);
  };

  const updateMediaStream = async (deviceId: string) => {
    if (!localStream) return;

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          frameRate: { ideal: frameRate },
        },
        audio: true
      });

      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => sender.track?.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(newStream.getVideoTracks()[0]);
        }
      }

      localStream.getVideoTracks().forEach(track => track.stop());
      localStream.removeTrack(localStream.getVideoTracks()[0]);
      localStream.addTrack(newStream.getVideoTracks()[0]);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      toast({
        title: "Camera Switch Error",
        description: "Failed to switch camera. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setIsConnecting(true);

    const initializeCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: currentCameraId ? { exact: currentCameraId } : undefined,
            frameRate: { ideal: frameRate },
          },
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const configuration = { 
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        };
        
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Set bitrate after adding tracks
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track?.kind === 'video');
        if (videoSender) {
          const parameters = videoSender.getParameters();
          if (!parameters.encodings) {
            parameters.encodings = [{}];
          }
          parameters.encodings[0].maxBitrate = bitrate * 1000;
          await videoSender.setParameters(parameters);
        }

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setIsConnecting(false);
          }
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            supabase.channel(channelName).send({
              type: 'broadcast',
              event: 'ice_candidate',
              payload: { candidate: event.candidate }
            });
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        supabase.channel(channelName).send({
          type: 'broadcast',
          event: 'offer',
          payload: { offer }
        });

      } catch (error) {
        console.error('Error initializing call:', error);
        
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          toast({
            title: "Permission Required",
            description: "Please allow access to your camera and microphone to start the call.",
            variant: "destructive",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(() => initializeCall())
                    .catch(() => {
                      toast({
                        title: "Permission Denied",
                        description: "Cannot start call without camera and microphone access.",
                        variant: "destructive"
                      });
                    });
                }}
              >
                Grant Access
              </Button>
            ),
          });
        } else {
          toast({
            title: "Call Error",
            description: "Failed to initialize call. Please try again.",
            variant: "destructive"
          });
        }
        setIsConnecting(false);
      }
    };

    initializeCall();

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

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      supabase.removeChannel(channel);
      setIsConnecting(false);
    };
  }, [isOpen, currentCameraId, frameRate, bitrate, channelName, toast]);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn, localStream]);

  const handleClose = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
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
