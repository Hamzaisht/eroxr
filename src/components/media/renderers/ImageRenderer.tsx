
import { RendererProps } from "./types";
import { Watermark } from "@/components/shared/Watermark";

export const ImageRenderer = ({ mediaItem, mediaUrl, onLoad, onError, showWatermark, username }: RendererProps) => {
  return (
    <div className="relative w-full h-full">
      <img
        src={mediaUrl}
        alt={mediaItem.alt_text || mediaItem.original_name || 'Image'}
        className="w-full h-full object-cover"
        onLoad={onLoad}
        onError={onError}
        loading="lazy"
      />
      {showWatermark && username && <Watermark username={username} />}
    </div>
  );
};
