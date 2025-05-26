
import { MediaType } from '@/utils/media/types';

interface UniversalMediaProps {
  src?: string;
  item?: {
    url: string;
    type: MediaType;
  };
  type?: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: () => void;
}

export const UniversalMedia = ({ 
  src, 
  item, 
  type, 
  alt, 
  className, 
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  onError
}: UniversalMediaProps) => {
  const mediaUrl = src || item?.url;
  const mediaType = type || item?.type;
  
  if (!mediaUrl) return null;

  const isVideo = mediaType === MediaType.VIDEO || 
    mediaUrl.includes('.mp4') || 
    mediaUrl.includes('.webm') || 
    mediaUrl.includes('.mov');
  
  if (isVideo) {
    return (
      <video 
        src={mediaUrl} 
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onError={onError}
      />
    );
  }
  
  return (
    <img 
      src={mediaUrl} 
      alt={alt} 
      className={className}
      onError={onError}
    />
  );
};
