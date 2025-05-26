
import React from 'react';
import { MediaType, getMediaTypeFromUrl } from '@/utils/media';

interface SimpleMediaDisplayProps {
  url: string;
  className?: string;
  alt?: string;
}

export const SimpleMediaDisplay: React.FC<SimpleMediaDisplayProps> = ({
  url,
  className = "",
  alt = "Media content"
}) => {
  if (!url) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center p-4 ${className}`}>
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  const mediaType = getMediaTypeFromUrl(url);

  switch (mediaType) {
    case MediaType.IMAGE:
      return (
        <img
          src={url}
          alt={alt}
          className={className}
          onError={(e) => {
            console.error('Image failed to load:', url);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );

    case MediaType.VIDEO:
      return (
        <video
          src={url}
          className={className}
          controls
          onError={(e) => {
            console.error('Video failed to load:', url);
          }}
        >
          Your browser does not support the video tag.
        </video>
      );

    case MediaType.AUDIO:
      return (
        <audio
          src={url}
          className={className}
          controls
          onError={(e) => {
            console.error('Audio failed to load:', url);
          }}
        >
          Your browser does not support the audio tag.
        </audio>
      );

    default:
      return (
        <div className={`bg-gray-100 flex items-center justify-center p-4 ${className}`}>
          <p className="text-gray-500">Unsupported media type</p>
        </div>
      );
  }
};
