
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayerContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  globalPlayback: boolean;
  setGlobalPlayback: (playing: boolean) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType>({
  isMuted: true, // Default to muted for autoplay
  setIsMuted: () => {},
  globalPlayback: false,
  setGlobalPlayback: () => {},
});

export const useVideoPlayerContext = () => useContext(VideoPlayerContext);

interface VideoPlayerProviderProps {
  children: ReactNode;
  initialMuted?: boolean;
}

export const VideoPlayerProvider = ({ 
  children, 
  initialMuted = true 
}: VideoPlayerProviderProps) => {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [globalPlayback, setGlobalPlayback] = useState(false);
  
  return (
    <VideoPlayerContext.Provider value={{
      isMuted,
      setIsMuted,
      globalPlayback,
      setGlobalPlayback
    }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};
