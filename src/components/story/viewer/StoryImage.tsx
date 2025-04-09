
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getUrlWithCacheBuster, fixBrokenStorageUrl } from "@/utils/mediaUtils";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
  creatorId: string;
  onError?: () => void;
}

export const StoryImage = ({ mediaUrl, username, isPaused, creatorId, onError }: StoryImageProps) => {
  const [watermarkUsername, setWatermarkUsername] = useState<string>(username);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  
  useEffect(() => {
    getUsernameForWatermark(creatorId).then(name => {
      setWatermarkUsername(name);
    }).catch(error => {
      console.error("Error fetching watermark username:", error);
    });
    
    // Reset loading state when URL changes
    setIsLoading(true);
    setLoadError(false);
    setHasRetried(false);
  }, [creatorId, mediaUrl]);
  
  // Fix potentially broken URL and add cache buster
  let fixedUrl = mediaUrl;
  if (fixedUrl) {
    fixedUrl = fixBrokenStorageUrl(fixedUrl);
    fixedUrl = getUrlWithCacheBuster(fixedUrl);
  }
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    console.log("Story image loaded:", fixedUrl);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setLoadError(true);
    console.error("Failed to load story image:", fixedUrl);
    
    if (!hasRetried) {
      // Try once more with a fresh cache buster
      setHasRetried(true);
      // Small delay before retry
      setTimeout(() => {
        setIsLoading(true);
        setLoadError(false);
      }, 500);
    } else if (onError) {
      onError();
    }
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setHasRetried(true);
  };
  
  if (!fixedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black"
      >
        <div className="text-red-500 flex flex-col items-center">
          <AlertCircle className="h-12 w-12" />
          <p className="mt-2">Image URL not available</p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black"
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-luxury-primary animate-spin" />
        </div>
      )}
      
      {/* Error state with retry button */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
          <AlertCircle className="h-12 w-12 mb-2" />
          <p className="mb-4">Failed to load image</p>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
          >
            <RefreshCw className="h-4 w-4" /> 
            Retry
          </button>
        </div>
      )}
      
      {/* Image */}
      <img
        src={fixedUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-contain max-h-[100vh]"
        loading="eager"
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          objectFit: 'contain',
          display: isLoading || loadError ? 'none' : 'block'
        }}
      />
      
      {/* Watermark overlay */}
      {!isLoading && !loadError && (
        <div className="watermark-overlay">
          www.eroxr.com/@{watermarkUsername}
        </div>
      )}
    </motion.div>
  );
};
