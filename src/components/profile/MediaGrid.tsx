import React, { useState, useCallback } from 'react';
import { Masonry } from '@mui/lab';
import { MediaSource } from '@/utils/media/types';

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

  const handleVideoThumbnailClick = (videoUrl: string | MediaSource) => {
    if (typeof videoUrl === 'string') {
      onMediaClick?.(videoUrl);
    } else {
      const url = videoUrl.video_url || 
        (videoUrl.video_urls && videoUrl.video_urls[0]) || 
        videoUrl.media_url || 
        (videoUrl.media_urls && videoUrl.media_urls[0]) || 
        videoUrl.url || 
        videoUrl.src;
      if (url) onMediaClick?.(url);
    }
  };

  return (
    <Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={1}>
      {media.map((item, index) => {
        const isVideo = typeof item === 'string' ? 
          item.toLowerCase().endsWith('.mp4') || item.toLowerCase().endsWith('.webm') :
          item.media_type === 'video' || item.content_type === 'video';

        const thumbnailUrl = typeof item === 'string' ? item :
          item.media_url || (item.media_urls && item.media_urls[0]) ||
          item.video_url || (item.video_urls && item.video_urls[0]) ||
          item.url || item.src;

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
                onClick={() => handleVideoThumbnailClick(item)}
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
                onClick={() => {
                  if (typeof item === 'string') {
                    onMediaClick?.(item);
                  } else {
                    const url = item.media_url || (item.media_urls && item.media_urls[0]) || item.url || item.src;
                    if (url) onMediaClick?.(url);
                  }
                }}
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
    </Masonry>
  );
};

export default MediaGrid;
