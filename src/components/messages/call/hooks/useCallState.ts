
import { useState } from "react";

export function useCallState(initialVideoState: boolean) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!initialVideoState);
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  return {
    isMuted,
    isVideoOff,
    showSettings,
    toggleAudio,
    toggleVideo,
    toggleSettings,
    setShowSettings
  };
}
