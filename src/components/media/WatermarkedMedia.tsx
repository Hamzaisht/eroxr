
import React from 'react';
import { UniversalMedia } from './UniversalMedia';

interface WatermarkedMediaProps {
  src: string;
  type: 'image' | 'video';
  creatorId: string;
  className?: string;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const WatermarkedMedia: React.FC<WatermarkedMediaProps> = ({
  src,
  type,
  creatorId,
  className = '',
  videoProps,
  imageProps
}) => {
  const mediaItem = {
    media_url: type === 'image' ? src : null,
    video_url: type === 'video' ? src : null,
    media_type: type,
    creator_id: creatorId,
  };
  
  return (
    <div className="relative">
      <UniversalMedia 
        item={mediaItem}
        className={className}
      />
    </div>
  );
};
