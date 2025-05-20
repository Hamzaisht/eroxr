import { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface VideoPreviewProps {
  videoUrl: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onError: () => void;
}

const VideoPreview = ({
  videoUrl,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  onError,
}: VideoPreviewProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!isFullScreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    onSeek(seekTime);
  };

  const handleError = () => {
    console.error("Video preview error:", videoUrl);
    onError();
  };
  
  return (
    <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-black">
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onPlayPause} className="p-1 rounded-full bg-white/10 hover:bg-white/20">
            {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-24 md:w-48 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-300">{currentTime.toFixed(0)}s / {duration.toFixed(0)}s</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-1 rounded-full bg-white/10 hover:bg-white/20">
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
          <button onClick={toggleFullScreen} className="p-1 rounded-full bg-white/10 hover:bg-white/20">
            {isFullScreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
      
      {videoUrl && (
        <UniversalMedia
          item={{
            url: videoUrl,
            type: MediaType.VIDEO
          }}
          className="w-full h-full object-cover"
          controls={false}
          autoPlay={isPlaying}
          muted={true}
          loop={false}
          onError={handleError}
        />
      )}
      
    </div>
  );
};

export default VideoPreview;
