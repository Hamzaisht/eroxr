
import { MediaRendererProps } from "@/utils/media/types";

export const ImageRenderer = ({ media, className }: MediaRendererProps) => {
  return (
    <img
      src={media.url}
      alt={media.alt || 'Image'}
      className={className}
      loading="lazy"
    />
  );
};
