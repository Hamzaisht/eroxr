
import React, { useState, useCallback } from 'react';
import { MediaSource, MediaType, stringToMediaType } from '@/utils/media/types';

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
    
    // Check all possible URL properties
    if (mediaItem.video_url) {
      return typeof mediaItem.video_url === 'string' ? mediaItem.video_url : mediaItem.video_url[0] || '';
    }
    
    if (mediaItem.media_url) {
      return typeof mediaItem.media_url === 'string' ? mediaItem.media_url : mediaItem.media_url[0] || '';
    }
    
    return mediaItem.url || mediaItem.src || '';
  };

  const isVideoMedia = (mediaItem: string | MediaSource): boolean => {
    if (typeof mediaItem === 'string') {
      return mediaItem.toLowerCase().endsWith('.mp4') || 
             mediaItem.toLowerCase().endsWith('.webm');
    }
    
    if (typeof mediaItem.media_type === 'string') {
      return mediaItem.media_type.toLowerCase() === 'video' ||
             stringToMediaType(mediaItem.media_type) === MediaType.VIDEO;
    }
    
    return mediaItem.media_type === MediaType.VIDEO || 
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
                  alt={`Media ${index + 1}`}
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            
            {hoveredIndex === index && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white">
                  {isVideo ? 'Play Video' : 'View Image'}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
