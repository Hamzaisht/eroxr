
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import { Watermark } from "@/components/shared/Watermark";
import { Maximize, Minimize, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  username?: string;
  media?: MediaAsset[]; // Legacy prop for backward compatibility
}

export const MediaRenderer = ({ assets, media, className = "", username }: MediaRendererProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [hasError, setHasError] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  
  // Use intersection observer to detect when video is in viewport
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of video is visible
    triggerOnce: false
  });

  // Use assets or fall back to media prop for backward compatibility
  const mediaAssets = assets || media || [];

  // Removed console logging to prevent re-render issues

  const currentAsset = mediaAssets[currentIndex];
  
  // Handle autoplay when video comes into view
  useEffect(() => {
    if (videoRef.current && currentAsset?.media_type === 'video') {
      if (inView) {
        videoRef.current.play().catch(err => {
          // Silent fail for autoplay
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView, currentAsset]);

  if (!mediaAssets || mediaAssets.length === 0) {
    return null;
  }

  const getMediaUrl = (storagePath: string) => {
    // Check if it's already a full URL
    if (storagePath.startsWith('http')) {
      return storagePath;
    }
    
    // Remove any leading slash and 'media/' prefix to normalize the path
    const cleanPath = storagePath.replace(/^\/+/, '').replace(/^media\//, '');
    
    // Generate public URL from media bucket
    const { data } = supabase.storage.from('media').getPublicUrl(cleanPath);
    const publicUrl = data?.publicUrl;
    
    return publicUrl || storagePath;
  };

  const handleImageLoad = (assetId: string) => {
    setIsLoading(prev => ({ ...prev, [assetId]: false }));
  };

  const handleImageError = (assetId: string) => {
    setIsLoading(prev => ({ ...prev, [assetId]: false }));
    setHasError(prev => ({ ...prev, [assetId]: true }));
  };

  if (!currentAsset) {
    return null;
  }

  const mediaUrl = getMediaUrl(currentAsset.storage_path);

  return (
    <>
      <div className={`relative overflow-hidden rounded-lg ${className}`} ref={inViewRef}>
        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Media Content */}
        <div className="relative aspect-video bg-gray-900">
        {currentAsset.media_type === 'image' ? (
          <img
            src={mediaUrl}
            alt={currentAsset.alt_text || currentAsset.original_name}
            className="w-full h-full object-cover"
            onLoad={() => handleImageLoad(currentAsset.id)}
            onError={() => handleImageError(currentAsset.id)}
            onLoadStart={() => {
              setIsLoading(prev => ({ ...prev, [currentAsset.id]: true }));
            }}
          />
        ) : currentAsset.media_type === 'video' ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-cover"
            controls
            muted
            loop
            playsInline
            preload="metadata"
            onLoadStart={() => {
              setIsLoading(prev => ({ ...prev, [currentAsset.id]: true }));
            }}
            onLoadedData={() => handleImageLoad(currentAsset.id)}
            onError={() => handleImageError(currentAsset.id)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p className="text-gray-400">Unsupported media type: {currentAsset.media_type}</p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading[currentAsset.id] && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error overlay with more details */}
        {hasError[currentAsset.id] && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-white text-sm mb-2">Failed to load media</p>
              <p className="text-gray-400 text-xs mb-1">Path: {currentAsset.storage_path}</p>
              <p className="text-gray-400 text-xs mb-1">URL: {mediaUrl}</p>
              <p className="text-gray-400 text-xs">Type: {currentAsset.media_type}</p>
            </div>
          </div>
        )}

        {/* Watermark */}
        {username && <Watermark username={username} />}
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

    {/* Fullscreen Modal */}
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Media */}
          <div className="relative max-w-full max-h-full">
            {currentAsset.media_type === 'image' ? (
              <img
                src={mediaUrl}
                alt={currentAsset.alt_text || currentAsset.original_name}
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : currentAsset.media_type === 'video' ? (
              <video
                ref={fullscreenVideoRef}
                src={mediaUrl}
                className="max-w-full max-h-[90vh] object-contain"
                controls
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            ) : null}

            {/* Watermark in fullscreen */}
            {username && <Watermark username={username} />}

            {/* Fullscreen Navigation for multiple media */}
            {mediaAssets.length > 1 && (
              <>
                {/* Dots indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {mediaAssets.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {currentIndex < mediaAssets.length - 1 && (
                  <button
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
};
