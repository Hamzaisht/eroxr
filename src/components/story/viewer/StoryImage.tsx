
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';
import { Loader2 } from "lucide-react";
import { getUrlWithCacheBuster } from "@/utils/mediaUtils";

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
  
  useEffect(() => {
    getUsernameForWatermark(creatorId).then(name => {
      setWatermarkUsername(name);
    }).catch(error => {
      console.error("Error fetching watermark username:", error);
    });
    
    // Reset loading state when URL changes
    setIsLoading(true);
    setLoadError(false);
  }, [creatorId, mediaUrl]);
  
  // Add cache buster to the media URL
  const displayUrl = getUrlWithCacheBuster(mediaUrl);
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    console.log("Story image loaded:", mediaUrl);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setLoadError(true);
    console.error("Failed to load story image:", mediaUrl);
    if (onError) onError();
  };
  
  if (!mediaUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black"
      >
        <div className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
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
      
      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2">Failed to load image</p>
        </div>
      )}
      
      {/* Image */}
      <img
        src={displayUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-contain max-h-[100vh]"
        loading="eager"
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
