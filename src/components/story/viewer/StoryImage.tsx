
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
  
  useEffect(() => {
    getUsernameForWatermark(creatorId).then(name => {
      setWatermarkUsername(name);
    }).catch(error => {
      console.error("Error fetching watermark username:", error);
    });
  }, [creatorId]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black aspect-[9/16] w-full h-full"
    >
      <img
        src={mediaUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-cover"
        loading="eager"
        style={{
          objectPosition: 'center center'
        }}
      />
      
      {/* Watermark overlay */}
      <div className="watermark-overlay">
        www.eroxr.com/@{watermarkUsername}
      </div>
    </motion.div>
  );
};
