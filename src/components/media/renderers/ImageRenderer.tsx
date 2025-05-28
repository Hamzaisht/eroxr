
import { RendererProps } from "./types";

export const ImageRenderer = ({ mediaItem, mediaUrl, onLoad, onError }: RendererProps) => {
  return (
    <img
      src={mediaUrl}
      alt={mediaItem.alt_text || mediaItem.original_name || 'Image'}
      className="w-full h-full object-cover"
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
    />
  );
};
