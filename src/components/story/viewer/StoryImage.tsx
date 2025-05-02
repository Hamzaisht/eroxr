
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
  creatorId: string;
  onError?: () => void;
}

export const StoryImage = ({ mediaUrl, username, isPaused, creatorId, onError }: StoryImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  const mediaItem = {
    media_url: mediaUrl,
    creator_id: creatorId,
    media_type: "image" as MediaType
  };
  
  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
  }, [creatorId, mediaUrl]);
  
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };
  
  const handleError = () => {
    setLoadError(true);
    setIsLoading(false);
    if (onError) onError();
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
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
      
      <UniversalMedia
        item={mediaItem}
        className="w-full h-full object-contain max-h-[100vh]"
        onLoad={handleLoad}
        onError={handleError}
      />
    </motion.div>
  );
};
