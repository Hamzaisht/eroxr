
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

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
      
      <style jsx>{`
        .watermark-overlay {
          position: absolute;
          bottom: 8px;
          right: 8px;
          padding: 4px 6px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 14px;
          font-weight: 600;
          font-family: sans-serif;
          border-radius: 2px;
          pointer-events: none;
          z-index: 10;
        }
        
        @media screen and (min-width: 768px) {
          .watermark-overlay {
            font-size: 18px;
            padding: 6px 8px;
          }
        }
      `}</style>
    </motion.div>
  );
};
