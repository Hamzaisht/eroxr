import { useState, useRef, useCallback, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface UseCallSignalingProps {
  callId?: string;
  isInitiator?: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
}

export const useCallSignaling = ({
  callId,
  isInitiator = false,
  onRemoteStream,
  onCallEnded
}: UseCallSignalingProps) => {
  const session = useSession();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalingChannel = useRef<any>(null);

  // ICE servers configuration
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  const initializePeerConnection = useCallback(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && signalingChannel.current) {
        signalingChannel.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            callId
          }
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        onRemoteStream?.(event.streams[0]);
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      const state = peerConnection.current?.connectionState;
      if (state === 'connected') {
        setIsConnected(true);
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setIsConnected(false);
        onCallEnded?.();
      }
    };
  }, [callId, onRemoteStream, onCallEnded]);

  const initializeSignaling = useCallback(() => {
    if (!callId) return;

    signalingChannel.current = supabase
      .channel(`call:${callId}`)
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!peerConnection.current) return;
        
        await peerConnection.current.setRemoteDescription(payload.offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        
        signalingChannel.current.send({
          type: 'broadcast',
          event: 'answer',
          payload: { answer }
        });
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (!peerConnection.current) return;
        await peerConnection.current.setRemoteDescription(payload.answer);
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        if (!peerConnection.current) return;
        await peerConnection.current.addIceCandidate(payload.candidate);
      })
      .on('broadcast', { event: 'call-ended' }, () => {
        onCallEnded?.();
      })
      .subscribe();
  }, [callId, onCallEnded]);

  const startCall = useCallback(async (videoEnabled: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: true
      });
      
      setLocalStream(stream);
      setIsVideoEnabled(videoEnabled);
      
      initializePeerConnection();
      initializeSignaling();

      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });

        if (isInitiator) {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          
          signalingChannel.current?.send({
            type: 'broadcast',
            event: 'offer',
            payload: { offer }
          });
        }
      }
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }, [isInitiator, initializePeerConnection, initializeSignaling]);

  const endCall = useCallback(async () => {
    // Notify other party
    signalingChannel.current?.send({
      type: 'broadcast',
      event: 'call-ended',
      payload: {}
    });

    // Clean up local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Unsubscribe from signaling
    if (signalingChannel.current) {
      supabase.removeChannel(signalingChannel.current);
      signalingChannel.current = null;
    }

    setIsConnected(false);

    // Update call status in database
    if (callId) {
      await supabase
        .from('call_history')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', callId);
    }
  }, [localStream, callId]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (signalingChannel.current) {
        supabase.removeChannel(signalingChannel.current);
      }
    };
  }, [localStream]);

  return {
    localStream,
    isConnected,
    isMuted,
    isVideoEnabled,
    startCall,
    endCall,
    toggleMute,
    toggleVideo
  };
};