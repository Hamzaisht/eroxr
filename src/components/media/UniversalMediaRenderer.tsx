
import { MediaRendererProps, MediaType } from "@/utils/media/types";
import { ImageRenderer } from "./renderers/ImageRenderer";
import { VideoRenderer } from "./renderers/VideoRenderer";
import { AudioRenderer } from "./renderers/AudioRenderer";
import { UniversalMedia } from "../shared/media/UniversalMedia";

export const UniversalMediaRenderer = (props: MediaRendererProps) => {
  const { media } = props;

  switch (media.type) {
    case MediaType.IMAGE:
      return <ImageRenderer {...props} />;
    
    case MediaType.VIDEO:
      return <VideoRenderer {...props} />;
    
    case MediaType.AUDIO:
      return <AudioRenderer {...props} />;
    
    case MediaType.DOCUMENT:
      // Fall back to the existing UniversalMedia component for documents
      return (
        <UniversalMedia
          src={media.url}
          type="document"
          alt={media.alt}
          className={props.className}
        />
      );
    
    default:
      return (
        <div className={`flex items-center justify-center bg-gray-900 p-8 ${props.className}`}>
          <p className="text-gray-400">Unsupported media type</p>
        </div>
      );
  }
};
