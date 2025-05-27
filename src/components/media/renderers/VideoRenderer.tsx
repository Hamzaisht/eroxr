
import { MediaRendererProps } from "@/utils/media/types";

export const VideoRenderer = ({ media, className, controls = true, autoPlay = false, muted = true, loop = false }: MediaRendererProps) => {
  return (
    <video
      src={media.url}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );
};
