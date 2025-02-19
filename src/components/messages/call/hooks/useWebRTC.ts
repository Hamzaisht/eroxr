
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseWebRTCProps {
  isOpen: boolean;
  channelName: string;
  currentCameraId: string;
  frameRate: number;
  bitrate: number;
}

export function useWebRTC({ 
  isOpen, 
  channelName, 
  currentCameraId, 
  frameRate,
  bitrate 
}: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { toast } = useToast();

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
      handleError(error as Error);
    }
  };

  const handleError = (error: Error) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      toast({
        title: "Permission Required",
        description: "Please allow access to your camera and microphone to start the call.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Call Error",
        description: "Failed to initialize call. Please try again.",
        variant: "destructive"
      });
    }
    setIsConnecting(false);
  };

  const cleanup = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    setIsConnecting(false);
  };

  return {
    localStream,
    isConnecting,
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    initializeCall,
    cleanup
  };
}
