
import { MediaErrorPlaceholder } from './renderers/MediaErrorPlaceholder';
import { MediaGrid } from './MediaRenderer/MediaGrid';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VideoRenderer } from './renderers/VideoRenderer';
import { AudioRenderer } from './renderers/AudioRenderer';
import { useValidMediaUrl } from '@/hooks/useValidMediaUrl';
import { getMediaType, isValidMediaAsset } from '@/utils/media/mediaUtils';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
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
  const [isMuted, setIsMuted] = useState(true);

  const mediaArray = Array.isArray(media) ? media : [media];
  
  console.log("MediaRenderer - Processing media:", mediaArray);

  const renderSingleMedia = (mediaItem: MediaAsset, index: number = 0) => {
    // Validate media asset
    if (!isValidMediaAsset(mediaItem)) {
      console.error("MediaRenderer - Invalid media asset:", mediaItem);
      return <MediaErrorPlaceholder mediaItem={mediaItem} error="Invalid media data" />;
    }

    const { url: mediaUrl, isLoading, isError, error } = useValidMediaUrl(mediaItem.storage_path);

    // Show loading state
    if (isLoading) {
      return (
        <div className={`flex items-center justify-center bg-gray-900 p-8 ${className}`}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mx-auto mb-2" />
            <p className="text-white text-sm">Loading media...</p>
          </div>
        </div>
      );
    }

    // Show error state
    if (isError || !mediaUrl) {
      console.error("MediaRenderer - Media loading error:", error);
      onError?.();
      return <MediaErrorPlaceholder mediaItem={mediaItem} error={error || "Failed to load media"} />;
    }

    // Determine media type
    const mediaType = getMediaType(mediaItem.media_type || mediaItem.mime_type, mediaItem.original_name);

    const commonProps = {
      mediaItem,
      mediaUrl,
      isLoading: false,
      showWatermark,
      onLoad: () => console.log(`MediaRenderer - Media loaded: ${mediaItem.id}`),
      onError: () => {
        console.error(`MediaRenderer - Media render error: ${mediaItem.id}`);
        onError?.();
      }
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
        return <MediaErrorPlaceholder mediaItem={mediaItem} error={`Unsupported media type: ${mediaType}`} />;
    }
  };

  // Filter valid media
  const validMediaArray = mediaArray.filter(isValidMediaAsset);
  
  if (validMediaArray.length === 0) {
    console.log("MediaRenderer - No valid media items found");
    return (
      <div className={className}>
        <MediaErrorPlaceholder 
          mediaItem={{ id: 'invalid', storage_path: '', media_type: '', mime_type: '' }} 
          error="No valid media items" 
        />
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
