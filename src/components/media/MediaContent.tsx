import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getEnlargedImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { Loader2, X, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaControls } from "./MediaControls";
import { MediaViewer } from "./MediaViewer";
import { supabase } from "@/integrations/supabase/client";

interface MediaContentProps {
  url: string;
  isVideo: boolean;
  creatorId?: string;
  username?: string;
  onClose?: () => void;
  onMediaClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showControls?: boolean;
}

export const MediaContent = ({ 
  url, 
  isVideo, 
  creatorId,
  username,
  onClose, 
  onMediaClick,
  onNext,
  onPrevious,
  showControls = false
}: MediaContentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showEnlargedMedia, setShowEnlargedMedia] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPublicUrl = async () => {
      try {
        if (url.startsWith('http')) {
          console.log("Using direct URL:", url);
          setPublicUrl(url);
          return;
        }
        
        if (url.includes('/')) {
          const parts = url.split('/');
          const bucket = parts[0];
          const path = parts.slice(1).join('/');
          
          console.log(`Fetching public URL for bucket: ${bucket}, path: ${path}`);
          
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          
          if (data?.publicUrl) {
            console.log("Retrieved public URL:", data.publicUrl);
            setPublicUrl(data.publicUrl);
          } else {
            console.warn("Could not get public URL, using original:", url);
            setPublicUrl(url);
          }
        } else {
          console.log("Using raw URL (not a storage path):", url);
          setPublicUrl(url);
        }
      } catch (error) {
        console.error("Error getting public URL:", error);
        setPublicUrl(url);
      }
    };
    
    getPublicUrl();
  }, [url]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getUrlWithCacheBuster = (baseUrl: string | null) => {
    if (!baseUrl) return '';
    const timestamp = Date.now();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${timestamp}&r=${Math.random().toString(36).substring(2, 9)}`;
  };

  const mediaUrlWithCacheBuster = getUrlWithCacheBuster(publicUrl);

  const handleImageError = () => {
    console.error("Failed to load image:", url);
    setIsImageError(true);
    setIsLoading(false);
  };

  const handleMediaClick = () => {
    if (onMediaClick) {
      onMediaClick();
    } else if (isVideo) {
      setShowEnlargedMedia(true);
    } else {
      setIsZoomed(!isZoomed);
    }
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully:", url);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    console.error("Video loading error:", url);
    setIsImageError(true);
    setIsLoading(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col bg-black/95 rounded-lg overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-end p-2 bg-black/80 z-10">
        {!isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-2"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
        
        {isFullscreen && (
          <button 
            onClick={toggleFullscreen}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors mr-2"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}
        
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <MediaControls 
        showControls={!!showControls && !!onNext && !!onPrevious} 
        onNext={onNext || (() => {})} 
        onPrevious={onPrevious || (() => {})} 
      />
      
      <div 
        className={cn(
          "flex-1 flex items-center justify-center relative bg-black/75",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        style={{ 
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {isLoading && !isImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
        
        <div className={cn(
          "relative max-w-full max-h-[80vh] flex items-center justify-center",
          isZoomed ? "scale-150 transition-transform duration-300" : "transition-transform duration-300"
        )}>
          {isVideo ? (
            <VideoPlayer
              url={mediaUrlWithCacheBuster}
              className="max-w-full max-h-[80vh]"
              showCloseButton={false}
              creatorId={creatorId}
              onClose={() => {}}
              autoPlay={true}
              onClick={handleMediaClick}
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
            />
          ) : (
            isImageError ? (
              <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-black/40 text-white">
                <AlertCircle className="h-12 w-12 text-red-400 mb-2" />
                <h3 className="text-lg font-medium">Failed to load image</h3>
                <p className="text-sm text-white/70 mt-1">
                  The image could not be loaded. It may have been deleted or is temporarily unavailable.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary rounded-md text-sm"
                >
                  Reload page
                </button>
              </div>
            ) : (
              <motion.div
                onClick={handleMediaClick}
                className="relative"
              >
                <img
                  src={mediaUrlWithCacheBuster}
                  alt="Media content"
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                  style={getEnlargedImageStyles()}
                  srcSet={generateSrcSet(mediaUrlWithCacheBuster)}
                  sizes={getResponsiveSizes()}
                  loading="eager"
                  decoding="sync"
                  onClick={handleMediaClick}
                  onLoad={() => setIsLoading(false)}
                  onError={handleImageError}
                  draggable="false"
                />
                
                <WatermarkOverlay creatorId={creatorId} username={username} />
              </motion.div>
            )
          )}
        </div>
      </div>

      {showEnlargedMedia && (
        <MediaViewer
          media={mediaUrlWithCacheBuster}
          onClose={() => setShowEnlargedMedia(false)}
          creatorId={creatorId}
        />
      )}
    </motion.div>
  );
};
