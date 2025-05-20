
import React from 'react';
import { UniversalMedia } from './UniversalMedia';
import { MediaType } from '@/utils/media/types';

interface WatermarkedMediaProps {
  src: string;
  type: MediaType;
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
    url: src,
    type: type,
    creator_id: creatorId
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
