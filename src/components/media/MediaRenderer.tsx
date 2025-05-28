
import { useState } from 'react';
import { AlertCircle, Play, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  alt_text?: string;
}

interface MediaRendererProps {
  media: MediaAsset;
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

  const handleError = () => {
    console.error('Media failed to load:', media.url);
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Ensure we have a proper Supabase storage URL
  const getMediaUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    // If it's just a path, construct the full Supabase URL
    return `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/media/${url}`;
  };

  const mediaUrl = getMediaUrl(media.url);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-white p-8 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-gray-400">Failed to load media</p>
        </div>
      </div>
    );
  }

  switch (media.type) {
    case 'image':
      return (
        <div className={`relative ${className}`}>
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
            alt={media.alt_text || 'Post image'}
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
        <div className={`relative ${className}`}>
          <video
            src={mediaUrl}
            className="w-full h-full object-cover rounded-lg"
            controls={controls}
            autoPlay={autoPlay}
            muted={isMuted}
            loop={autoPlay}
            playsInline
            preload="metadata"
            poster={`${mediaUrl}?t=1`} // Generate thumbnail from first frame
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
        <div className={`bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg ${className}`}>
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
              {media.alt_text && (
                <p className="text-white text-sm mt-2">{media.alt_text}</p>
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
        <div className={`flex items-center justify-center bg-gray-900 text-white p-8 ${className}`}>
          <p className="text-gray-400">Unsupported media type: {media.type}</p>
        </div>
      );
  }
};
