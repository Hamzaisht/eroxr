
import { useEffect } from "react";

export function useMediaTracks(
  localStream: MediaStream | null,
  isMuted: boolean,
  isVideoOn: boolean
) {
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
}
