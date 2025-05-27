
import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaRendererProps {
  media: {
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio';
    alt_text?: string;
  };
  className?: string;
  autoPlay?: boolean;
}

export const MediaRenderer = ({ media, className = "", autoPlay = false }: MediaRendererProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  if (media.type === 'image') {
    return (
      <img 
        src={media.url} 
        alt={media.alt_text || 'Post media'}
        className={`w-full object-cover ${className}`}
      />
    );
  }

  if (media.type === 'video') {
    return (
      <div className="relative group">
        <video 
          src={media.url}
          className={`w-full object-cover cursor-pointer ${className}`}
          onClick={handleVideoClick}
          autoPlay={autoPlay}
          muted={isMuted}
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <button
            onClick={handleVideoClick}
            className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-1" />
            )}
          </button>
        </div>
        
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
    );
  }

  if (media.type === 'audio') {
    return (
      <div className={`bg-luxury-darker rounded-lg p-4 border border-luxury-neutral/20 ${className}`}>
        <audio 
          src={media.url}
          controls
          className="w-full"
          style={{
            filter: 'invert(1) hue-rotate(180deg)',
          }}
        >
          Your browser does not support the audio element.
        </audio>
        {media.alt_text && (
          <p className="text-sm text-luxury-neutral/60 mt-2 truncate">
            {media.alt_text}
          </p>
        )}
      </div>
    );
  }

  return null;
};
