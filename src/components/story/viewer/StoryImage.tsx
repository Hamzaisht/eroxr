
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import '../../../styles/watermark.css';

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
  creatorId: string;
}

export const StoryImage = ({ mediaUrl, username, isPaused, creatorId }: StoryImageProps) => {
  const [watermarkUsername, setWatermarkUsername] = useState<string>(username);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getUsernameForWatermark(creatorId).then(name => {
      setWatermarkUsername(name);
    }).catch(error => {
      console.error("Error fetching watermark username:", error);
    });
    
    // Reset loading state when URL changes
    setIsLoading(true);
  }, [creatorId, mediaUrl]);
  
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
          <div className="w-8 h-8 border-4 border-luxury-primary/30 border-t-luxury-primary rounded-full animate-spin" />
        </div>
      )}
      
      {/* Image */}
      <img
        src={mediaUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-contain max-h-[100vh]"
        loading="eager"
        onLoad={() => setIsLoading(false)}
        style={{
          objectFit: 'contain',
          display: isLoading ? 'none' : 'block'
        }}
      />
      
      {/* Watermark overlay */}
      <div className="watermark-overlay">
        www.eroxr.com/@{watermarkUsername}
      </div>
    </motion.div>
  );
};
