
import { VideoRendererProps } from "./types";

export const VideoRenderer = ({ 
  mediaItem, 
  mediaUrl, 
  controls, 
  autoPlay, 
  isMuted, 
  onMuteToggle, 
  onLoad, 
  onError 
}: VideoRendererProps) => {
  return (
    <video
      src={mediaUrl}
      className="w-full h-full object-cover"
      controls={controls}
      autoPlay={autoPlay}
      muted={isMuted}
      onLoadedData={onLoad}
      onError={onError}
      preload="metadata"
      playsInline
    >
      Your browser does not support the video tag.
    </video>
  );
};
