
import React, { useState, useCallback } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';

interface MediaGridProps {
  media: (string | MediaSource)[];
  onMediaClick?: (url: string) => void;
}

const MediaGrid = ({ media, onMediaClick }: MediaGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const extractUrl = (mediaItem: string | MediaSource): string => {
    if (typeof mediaItem === 'string') {
      return mediaItem;
    }
    
    return mediaItem.video_url || 
           mediaItem.media_url || 
           mediaItem.url || 
           mediaItem.src || 
           '';
  };

  const isVideoMedia = (mediaItem: string | MediaSource): boolean => {
    if (typeof mediaItem === 'string') {
      return mediaItem.toLowerCase().endsWith('.mp4') || 
             mediaItem.toLowerCase().endsWith('.webm');
    }
    
    return mediaItem.media_type === MediaType.VIDEO || 
           mediaItem.media_type === 'video' || 
           mediaItem.content_type === 'video' ||
           !!mediaItem.video_url;
  };

  const handleMediaClick = (mediaItem: string | MediaSource) => {
    const url = extractUrl(mediaItem);
    if (url && onMediaClick) onMediaClick(url);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
      {media.map((item, index) => {
        const isVideo = isVideoMedia(item);
        const thumbnailUrl = extractUrl(item);

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {isVideo ? (
              <div
                className="aspect-w-16 aspect-h-9 cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                <img
                  src={thumbnailUrl || undefined}
                  alt={`Video thumbnail ${index + 1}`}
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div
                className="aspect-w-1 aspect-h-1 cursor-pointer"
                onClick={() => handleMediaClick(item)}
              >
                <img
                  src={thumbnailUrl || undefined}
                  alt={`Image ${index + 1}`}
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {isVideo ? 'Play Video' : 'View Image'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
