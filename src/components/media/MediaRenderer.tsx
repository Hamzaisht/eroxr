
import { MediaErrorPlaceholder } from './renderers/MediaErrorPlaceholder';
import { MediaGrid } from './MediaRenderer/MediaGrid';
import { useMediaRenderer } from './MediaRenderer/hooks/useMediaRenderer';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VideoRenderer } from './renderers/VideoRenderer';
import { AudioRenderer } from './renderers/AudioRenderer';

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  alt_text?: string;
  original_name?: string;
  user_id?: string;
  metadata?: {
    post_id?: string;
    [key: string]: any;
  };
}

interface MediaRendererProps {
  media: MediaAsset | MediaAsset[];
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  showWatermark?: boolean;
  onError?: () => void;
}

export const MediaRenderer = ({ 
  media, 
  className = "", 
  autoPlay = false, 
  controls = true,
  showWatermark = false,
  onError 
}: MediaRendererProps) => {
  const {
    isLoading,
    isMuted,
    failedAssets,
    setIsMuted,
    handleError,
    handleLoad,
    getMediaUrl,
    getMediaType
  } = useMediaRenderer();

  const mediaArray = Array.isArray(media) ? media : [media];
  
  console.log("MediaRenderer - Received media:", mediaArray);

  const renderSingleMedia = (mediaItem: MediaAsset, index: number = 0) => {
    if (!mediaItem || !mediaItem.storage_path) {
      console.error("MediaRenderer - Invalid media item:", mediaItem);
      return <MediaErrorPlaceholder mediaItem={mediaItem || { id: 'unknown', storage_path: '', media_type: '' }} error="Invalid media data" />;
    }

    if (failedAssets.has(mediaItem.id)) {
      return <MediaErrorPlaceholder mediaItem={mediaItem} error="Previously failed to load" />;
    }

    const mediaUrl = getMediaUrl(mediaItem.storage_path);
    if (!mediaUrl) {
      return <MediaErrorPlaceholder mediaItem={mediaItem} error="Invalid storage path" />;
    }

    const mediaType = getMediaType(mediaItem.media_type);

    const commonProps = {
      mediaItem,
      mediaUrl,
      isLoading,
      showWatermark,
      onLoad: handleLoad,
      onError: () => handleError(mediaItem.id, mediaItem.storage_path, onError)
    };

    switch (mediaType) {
      case 'image':
        return <ImageRenderer {...commonProps} />;
      case 'video':
        return (
          <VideoRenderer 
            {...commonProps}
            controls={controls}
            autoPlay={autoPlay}
            isMuted={isMuted}
            onMuteToggle={() => setIsMuted(!isMuted)}
          />
        );
      case 'audio':
        return <AudioRenderer {...commonProps} controls={controls} />;
      default:
        return <MediaErrorPlaceholder mediaItem={mediaItem} error={`Unsupported media type: ${mediaItem.media_type}`} />;
    }
  };

  if (mediaArray.length === 0) {
    console.log("MediaRenderer - No media to render");
    return null;
  }

  const validMediaArray = mediaArray.filter(item => item && item.storage_path && item.id);
  
  if (validMediaArray.length === 0) {
    console.error("MediaRenderer - No valid media items found");
    return (
      <div className={className}>
        <MediaErrorPlaceholder mediaItem={{ id: 'invalid', storage_path: '', media_type: '' }} error="No valid media items" />
      </div>
    );
  }

  if (validMediaArray.length === 1) {
    return (
      <div className={className}>
        {renderSingleMedia(validMediaArray[0])}
      </div>
    );
  }

  return (
    <MediaGrid 
      mediaArray={validMediaArray}
      renderSingleMedia={renderSingleMedia}
      className={className}
    />
  );
};
