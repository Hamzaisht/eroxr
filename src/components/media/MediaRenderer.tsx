
import { MediaErrorPlaceholder } from './renderers/MediaErrorPlaceholder';
import { MediaGrid } from './MediaRenderer/MediaGrid';
import { ImageRenderer } from './renderers/ImageRenderer';
import { VideoRenderer } from './renderers/VideoRenderer';
import { AudioRenderer } from './renderers/AudioRenderer';
import { getMediaType, isValidMediaAsset, getValidMediaUrl } from '@/utils/media/mediaUtils';
import { useState, useMemo } from 'react';
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

  // Memoize valid media to prevent recalculation
  const validMediaArray = useMemo(() => 
    mediaArray.filter(isValidMediaAsset), 
    [mediaArray]
  );

  const renderSingleMedia = (mediaItem: MediaAsset, index: number = 0) => {
    // Validate media asset
    if (!isValidMediaAsset(mediaItem)) {
      console.error("MediaRenderer - Invalid media asset:", mediaItem);
      return <MediaErrorPlaceholder mediaItem={mediaItem} error="Invalid media data" />;
    }

    // Generate URL directly without hook to prevent infinite loops
    const mediaUrl = getValidMediaUrl(mediaItem.storage_path);

    if (!mediaUrl) {
      console.error("MediaRenderer - Media URL generation failed:", mediaItem.storage_path);
      onError?.();
      return <MediaErrorPlaceholder mediaItem={mediaItem} error="Failed to generate media URL" />;
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
