
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  original_name: string;
  alt_text?: string;
}

interface MediaRendererProps {
  assets: MediaAsset[];
  className?: string;
  media?: MediaAsset[]; // Legacy prop for backward compatibility
}

export const MediaRenderer = ({ assets, media, className = "" }: MediaRendererProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [hasError, setHasError] = useState<Record<string, boolean>>({});

  // Use assets or fall back to media prop for backward compatibility
  const mediaAssets = assets || media || [];

  if (!mediaAssets || mediaAssets.length === 0) {
    return null;
  }

  const getMediaUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const handleImageLoad = (assetId: string) => {
    setIsLoading(prev => ({ ...prev, [assetId]: false }));
  };

  const handleImageError = (assetId: string) => {
    console.error(`Failed to load media asset: ${assetId}`);
    setIsLoading(prev => ({ ...prev, [assetId]: false }));
    setHasError(prev => ({ ...prev, [assetId]: true }));
  };

  const currentAsset = mediaAssets[currentIndex];
  const mediaUrl = getMediaUrl(currentAsset.storage_path);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Media Content */}
      <div className="relative aspect-video bg-gray-900">
        {currentAsset.media_type === 'image' ? (
          <img
            src={mediaUrl}
            alt={currentAsset.alt_text || currentAsset.original_name}
            className="w-full h-full object-cover"
            onLoad={() => handleImageLoad(currentAsset.id)}
            onError={() => handleImageError(currentAsset.id)}
          />
        ) : currentAsset.media_type === 'video' ? (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            onLoadStart={() => setIsLoading(prev => ({ ...prev, [currentAsset.id]: true }))}
            onLoadedData={() => handleImageLoad(currentAsset.id)}
            onError={() => handleImageError(currentAsset.id)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p className="text-gray-400">Unsupported media type</p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading[currentAsset.id] && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error overlay */}
        {hasError[currentAsset.id] && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-white text-sm">Failed to load media</p>
          </div>
        )}
      </div>

      {/* Multiple media navigation */}
      {mediaAssets.length > 1 && (
        <>
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {mediaAssets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {currentIndex < mediaAssets.length - 1 && (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
};
