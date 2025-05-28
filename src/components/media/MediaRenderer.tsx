
import { useState } from 'react';
import { AlertCircle, Play, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  alt_text?: string;
  original_name?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Handle both single media and array of media
  const mediaArray = Array.isArray(media) ? media : [media];
  
  console.log("MediaRenderer - Received media:", mediaArray);

  const handleError = () => {
    console.error('MediaRenderer - Media failed to load');
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    console.log('MediaRenderer - Media loaded successfully');
    setIsLoading(false);
    setHasError(false);
  };

  // Build correct Supabase storage URL from storage_path
  const getMediaUrl = (storagePath: string) => {
    // Clean the storage path - remove any leading slashes
    const cleanPath = storagePath.replace(/^\/+/, '');
    const url = `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${cleanPath}`;
    console.log("MediaRenderer - Built media URL:", { storagePath, cleanPath, url });
    return url;
  };

  // FIXED: Determine media type from media_type field correctly
  const getMediaType = (mediaType: string): 'image' | 'video' | 'audio' => {
    console.log("MediaRenderer - Determining media type for:", mediaType);
    
    // Check the media_type field first
    if (mediaType === 'video' || mediaType.startsWith('video/')) return 'video';
    if (mediaType === 'image' || mediaType.startsWith('image/')) return 'image';
    if (mediaType === 'audio' || mediaType.startsWith('audio/')) return 'audio';
    
    // Fallback to 'image' for unknown types
    console.warn("MediaRenderer - Unknown media type, defaulting to image:", mediaType);
    return 'image';
  };

  const renderSingleMedia = (mediaItem: MediaAsset, index: number = 0) => {
    const mediaUrl = getMediaUrl(mediaItem.storage_path);
    const mediaType = getMediaType(mediaItem.media_type);

    console.log(`MediaRenderer - Rendering media ${index}:`, { 
      mediaType, 
      mediaUrl, 
      storage_path: mediaItem.storage_path,
      media_type: mediaItem.media_type
    });

    if (hasError) {
      return (
        <div className="flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm text-gray-400">Failed to load media</p>
            <p className="text-xs text-gray-500 mt-1">{mediaItem.storage_path}</p>
          </div>
        </div>
      );
    }

    switch (mediaType) {
      case 'image':
        return (
          <div className="relative">
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg"
                />
              )}
            </AnimatePresence>
            <img
              src={mediaUrl}
              alt={mediaItem.alt_text || mediaItem.original_name || 'Post image'}
              className={`w-full h-full object-cover rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleLoad}
              onError={handleError}
            />
            {showWatermark && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Eroxr
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="relative">
            <video
              src={mediaUrl}
              className="w-full h-full object-cover rounded-lg"
              controls={controls}
              autoPlay={autoPlay}
              muted={isMuted}
              loop={autoPlay}
              playsInline
              preload="metadata"
              onLoadedData={handleLoad}
              onError={handleError}
            />
            
            {/* Custom video controls overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {showWatermark && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Eroxr
              </div>
            )}
            
            {/* Play button overlay for non-autoplay videos */}
            {!autoPlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <audio
                  src={mediaUrl}
                  controls={controls}
                  className="w-full"
                  preload="metadata"
                  onLoadedData={handleLoad}
                  onError={handleError}
                />
                {mediaItem.alt_text && (
                  <p className="text-white text-sm mt-2">{mediaItem.alt_text}</p>
                )}
              </div>
            </div>
            {showWatermark && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Eroxr
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center bg-gray-900 text-white p-8">
            <p className="text-gray-400">Unsupported media type: {mediaItem.media_type}</p>
          </div>
        );
    }
  };

  // If no media, return null
  if (mediaArray.length === 0) {
    console.log("MediaRenderer - No media to render");
    return null;
  }

  // Single media item
  if (mediaArray.length === 1) {
    return (
      <div className={className}>
        {renderSingleMedia(mediaArray[0])}
      </div>
    );
  }

  // Multiple media items - grid layout
  return (
    <div className={`grid grid-cols-2 gap-1 ${className}`}>
      {mediaArray.slice(0, 4).map((mediaItem, index) => (
        <div key={mediaItem.id || index} className="relative aspect-square">
          {renderSingleMedia(mediaItem, index)}
          {index === 3 && mediaArray.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                +{mediaArray.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
