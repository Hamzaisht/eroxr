
import React, { useState, useCallback } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';
import { stringToMediaType } from '@/utils/media/types';

interface MediaGridProps {
  mediaItems: MediaSource[];
  onMediaSelect?: (media: MediaSource) => void;
  className?: string;
  minimal?: boolean;
  autoHeight?: boolean;
  maxItems?: number;
}

export const MediaGrid = ({ 
  mediaItems, 
  onMediaSelect,
  className = '',
  minimal = false,
  autoHeight = false,
  maxItems
}: MediaGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = useCallback((media: MediaSource) => {
    if (onMediaSelect) {
      onMediaSelect(media);
    }
  }, [onMediaSelect]);
  
  const displayItems = maxItems ? mediaItems.slice(0, maxItems) : mediaItems;
  const hasMore = maxItems ? mediaItems.length > maxItems : false;

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  const getMediaUrl = (media: MediaSource): string => {
    return media.media_url || media.video_url || media.url || media.thumbnail_url || '';
  };
  
  const getAspectRatioClass = (index: number, total: number) => {
    if (total === 1) return 'aspect-video';
    if (total === 2) return 'aspect-square';
    if (total === 3) {
      return index === 0 ? 'aspect-video' : 'aspect-square';
    }
    if (total === 4) {
      return 'aspect-square';
    }
    return 'aspect-square';
  };

  const getGridTemplateClass = (total: number) => {
    if (total === 1) return 'grid-cols-1';
    if (total === 2) return 'grid-cols-2';
    if (total === 3) return 'grid-cols-2';
    if (total === 4) return 'grid-cols-2';
    if (total >= 5) return 'grid-cols-3';
    return 'grid-cols-1';
  };

  const getMediaType = (media: MediaSource): MediaType => {
    const url = getMediaUrl(media);
    const mediaType = media.media_type;
    
    if (mediaType) {
      return stringToMediaType(mediaType as string);
    }
    
    // Infer from URL
    if (url.match(/\.(mp4|webm|mov)$/i)) {
      return MediaType.VIDEO;
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return MediaType.IMAGE;
    } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
      return MediaType.AUDIO;
    }
    
    return MediaType.UNKNOWN;
  };

  return (
    <div 
      className={`grid gap-1 w-full ${getGridTemplateClass(displayItems.length)} ${className}`}
      style={autoHeight ? { height: 'auto' } : {}}
    >
      {displayItems.map((media, index) => {
        const mediaUrl = getMediaUrl(media);
        const mediaType = getMediaType(media);
        const isVideo = mediaType === MediaType.VIDEO;
        
        return (
          <div
            key={`${mediaUrl}-${index}`}
            className={`${getAspectRatioClass(index, displayItems.length)} relative overflow-hidden rounded-md cursor-pointer border border-white/5`}
            onClick={() => handleClick(media)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {isVideo ? (
              <>
                {/* Video Thumbnail */}
                <img
                  src={media.thumbnail_url || mediaUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 3L12 8L4 13V3Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <img
                src={mediaUrl}
                alt="Media"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Show overlay on hover */}
            {hoveredIndex === index && !minimal && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H21V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21H3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 3L14 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 21L10 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Show "View More" button if maxItems is set and there are more items */}
      {hasMore && (
        <div 
          className="aspect-square relative overflow-hidden rounded-md cursor-pointer border border-white/5 bg-black/30 flex items-center justify-center"
          onClick={() => onMediaSelect?.(mediaItems[maxItems!])}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">+{mediaItems.length - maxItems!}</div>
            <div className="text-sm">View More</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export as both named and default export for backward compatibility
export default MediaGrid;
