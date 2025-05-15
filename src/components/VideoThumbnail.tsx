
import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface VideoThumbnailProps {
  videoUrl: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showPlayButton?: boolean;
  posterUrl?: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoUrl,
  autoplay = false,
  muted = true,
  loop = true, 
  controls = false,
  showPlayButton = true,
  posterUrl,
  onPlay,
  onPause,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePlayPause = () => {
    const video = document.getElementById(`video-${videoUrl}`) as HTMLVideoElement;
    
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        video.play()
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch(err => {
            console.error('Error playing video:', err);
            // Handle autoplay restrictions gracefully
            setIsPlaying(false);
          });
      }
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const video = document.getElementById(`video-${videoUrl}`) as HTMLVideoElement;
    
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        id={`video-${videoUrl}`}
        src={videoUrl}
        poster={posterUrl}
        autoPlay={autoplay}
        muted={isMuted}
        loop={loop}
        playsInline
        controls={controls}
        className="w-full h-full object-cover"
      />
      
      {showPlayButton && !isPlaying && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
          onClick={handlePlayPause}
        >
          <Play className="w-12 h-12 text-white" />
        </div>
      )}
      
      {isHovered && (
        <div className="absolute bottom-2 right-2">
          <button 
            onClick={toggleMute} 
            className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            {isMuted ? 
              <VolumeX className="w-4 h-4" /> : 
              <Volume2 className="w-4 h-4" />
            }
          </button>
        </div>
      )}
    </div>
  );
};
