
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCamera() {
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string>('');
  const { toast } = useToast();

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

  const updateMediaStream = async (
    deviceId: string, 
    localStream: MediaStream | null,
    peerConnection: RTCPeerConnection | null,
    frameRate: number,
    videoRef: React.RefObject<HTMLVideoElement>
  ) => {
    if (!localStream) return;

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          frameRate: { ideal: frameRate },
        },
        audio: true
      });

      if (peerConnection) {
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track?.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(newStream.getVideoTracks()[0]);
        }
      }

      localStream.getVideoTracks().forEach(track => track.stop());
      localStream.removeTrack(localStream.getVideoTracks()[0]);
      localStream.addTrack(newStream.getVideoTracks()[0]);

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
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

  return {
    availableCameras,
    currentCameraId,
    setCurrentCameraId,
    updateMediaStream
  };
}
