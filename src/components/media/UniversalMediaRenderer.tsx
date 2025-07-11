
import { useState } from "react";
import { MediaRendererProps, MediaType } from "@/utils/media/types";
import { ImageRenderer } from "./renderers/ImageRenderer";
import { VideoRenderer } from "./renderers/VideoRenderer";
import { AudioRenderer } from "./renderers/AudioRenderer";
import { UniversalMedia } from "../shared/media/UniversalMedia";
import { Watermark } from "@/components/shared/Watermark";

export const UniversalMediaRenderer = (props: MediaRendererProps) => {
  const { media, className, controls = true, autoPlay = false, muted = true, showWatermark = false, username } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(muted);

  // Transform MediaItem to MediaAsset format
  const mediaAsset = {
    id: media.id || 'unknown',
    storage_path: media.url,
    media_type: media.type,
    alt_text: media.alt,
    original_name: media.alt || 'media',
    user_id: undefined,
    metadata: {}
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const commonProps = {
    mediaItem: mediaAsset,
    mediaUrl: media.url,
    isLoading,
    showWatermark,
    username,
    onLoad: handleLoad,
    onError: handleError
  };

  switch (media.type) {
    case MediaType.IMAGE:
      return <ImageRenderer {...commonProps} />;
    
    case MediaType.VIDEO:
      return (
        <VideoRenderer 
          {...commonProps}
          controls={controls}
          autoPlay={autoPlay}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
        />
      );
    
    case MediaType.AUDIO:
      return (
        <AudioRenderer 
          {...commonProps}
          controls={controls}
        />
      );
    
    case MediaType.DOCUMENT:
      // Fall back to the existing UniversalMedia component for documents
      return (
        <UniversalMedia
          src={media.url}
          type="document"
          alt={media.alt}
          className={className}
        />
      );
    
    default:
      return (
        <div className={`relative flex items-center justify-center bg-gray-900 p-8 ${className}`}>
          <p className="text-gray-400">Unsupported media type</p>
          {showWatermark && username && <Watermark username={username} />}
        </div>
      );
  }
};
