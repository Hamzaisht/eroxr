
import { VideoRendererProps } from "./types";
import { Watermark } from "@/components/shared/Watermark";

export const VideoRenderer = ({ 
  mediaItem, 
  mediaUrl, 
  controls, 
  autoPlay, 
  isMuted, 
  onMuteToggle, 
  onLoad, 
  onError,
  showWatermark,
  username
}: VideoRendererProps) => {
  return (
    <div className="relative w-full h-full">
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
      {showWatermark && username && <Watermark username={username} />}
    </div>
  );
};
