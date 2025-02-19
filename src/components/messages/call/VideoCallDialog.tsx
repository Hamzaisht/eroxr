
import { useState, useRef, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoControls } from "./VideoControls";
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
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const session = useSession();
  const { toast } = useToast();

  const channelName = `call:${session?.user?.id}:${recipientId}`;
  
  // Setup real-time tip notifications
  useTipNotifications(recipientId);

  // Initialize WebRTC
  useEffect(() => {
    if (!isOpen) return;

    const initializeCall = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize RTCPeerConnection
        const configuration = { 
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        };
        
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        // Add local stream tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Handle incoming streams
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle and send ICE candidates via Supabase Realtime
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            supabase.channel(channelName).send({
              type: 'broadcast',
              event: 'ice_candidate',
              payload: { candidate: event.candidate }
            });
          }
        };

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        supabase.channel(channelName).send({
          type: 'broadcast',
          event: 'offer',
          payload: { offer }
        });

      } catch (error) {
        console.error('Error initializing call:', error);
        toast({
          title: "Call Error",
          description: "Failed to initialize call. Please check your camera/microphone permissions.",
          variant: "destructive"
        });
      }
    };

    initializeCall();

    // Subscribe to WebRTC signaling channel
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

    // Cleanup function
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      supabase.removeChannel(channel);
    };
  }, [isOpen, isVideoEnabled, channelName, toast]);

  // Handle mute/unmute
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  // Handle video on/off
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn, localStream]);

  const handleClose = () => {
    // Stop all tracks
    localStream?.getTracks().forEach(track => track.stop());
    // Close peer connection
    peerConnectionRef.current?.close();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] bg-black/90">
        <div className="relative video-container h-[600px] rounded-lg overflow-hidden">
          {/* Local video */}
          <video
            ref={localVideoRef}
            className="absolute bottom-4 right-4 w-48 h-32 rounded-lg border border-white/20"
            autoPlay
            muted
            playsInline
          />
          
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <VideoControls
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                isVideoOn={isVideoOn}
                setIsVideoOn={setIsVideoOn}
                isVideoEnabled={isVideoEnabled}
              />

              <div className="flex items-center gap-4">
                <TippingControls
                  recipientId={recipientId}
                  channelName={channelName}
                />
                
                <Button variant="destructive" onClick={handleClose}>
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
