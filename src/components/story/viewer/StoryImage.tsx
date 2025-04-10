import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getUrlWithCacheBuster, refreshUrl } from "@/utils/mediaUtils";

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
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(mediaUrl);
  const MAX_RETRIES = 2;
  
  useEffect(() => {
    setCurrentSrc(getUrlWithCacheBuster(mediaUrl));
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
    getUsernameForWatermark(creatorId).then(name => {
      setWatermarkUsername(name);
    }).catch(error => {
      console.error("Error fetching watermark username:", error);
    });
  }, [creatorId, mediaUrl]);
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    console.log("Story image loaded:", mediaUrl);
  };
  
  const handleImageError = () => {
    console.error("Failed to load story image:", currentSrc);
    setIsLoading(false);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying image load (${retryCount + 1}/${MAX_RETRIES}):`, mediaUrl);
      setRetryCount(prev => prev + 1);
      
      setTimeout(() => {
        const freshUrl = refreshUrl(mediaUrl);
        setCurrentSrc(freshUrl);
        setIsLoading(true);
      }, 500);
    } else {
      setLoadError(true);
      
      if (onError) {
        onError();
      }
    }
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
    const freshUrl = refreshUrl(mediaUrl);
    setCurrentSrc(freshUrl);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-luxury-primary animate-spin" />
        </div>
      )}
      
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
      
      <img
        src={currentSrc}
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
      
      {!isLoading && !loadError && (
        <div className="watermark-overlay">
          www.eroxr.com/@{watermarkUsername}
        </div>
      )}
    </motion.div>
  );
};
