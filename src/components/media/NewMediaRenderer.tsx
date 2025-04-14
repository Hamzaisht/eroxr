
import React, { useState, useEffect } from 'react';
import { getPlayableMediaUrl, getContentType } from '@/utils/mediaUtils';
import { Loader2, AlertCircle } from 'lucide-react';

interface NewMediaRendererProps {
  item: any;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const NewMediaRenderer: React.FC<NewMediaRendererProps> = ({
  item,
  className = '',
  autoPlay = false,
  controls = true,
  onLoad,
  onError,
  onEnded
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Process the media item to get the URL and determine the media type
  useEffect(() => {
    try {
      // Get the playable URL
      const url = getPlayableMediaUrl(item);
      
      if (!url) {
        setError('No media URL found');
        setIsLoading(false);
        return;
      }
      
      setMediaUrl(url);
      
      // Determine if this is an image or video
      const contentType = item.content_type || item.media_type || 
        (typeof url === 'string' ? getContentType(url) : 'image');
      
      setMediaType(contentType === 'video' ? 'video' : 'image');
      
      // Log the URL for debugging
      console.log(`Media URL (${contentType}):`, url);
      
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Failed to process media');
      setIsLoading(false);
      if (onError) onError();
    }
  }, [item]);

  // Handle successful media load
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle media error
  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load media');
    console.error('Media failed to load:', mediaUrl);
    if (onError) onError();
  };

  // If there's an error, show error state
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center p-4 text-white/70">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
          <p className="text-xs mt-1 text-white/50">URL: {mediaUrl || 'none'}</p>
        </div>
      </div>
    );
  }

  // Get alt text if available
  const altText = typeof item === 'object' && item.alt_text ? item.alt_text : 'Media content';
  
  // Get poster URL if available (for videos)
  const posterUrl = typeof item === 'object' && item.poster_url ? item.poster_url : undefined;

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white/70" />
        </div>
      )}
      
      {/* Media content */}
      {mediaType === 'video' ? (
        <video
          src={mediaUrl}
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          autoPlay={autoPlay}
          controls={controls}
          poster={posterUrl}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
          onEnded={onEnded}
          loop={!onEnded}
        />
      ) : (
        <img
          src={mediaUrl}
          alt={altText}
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
