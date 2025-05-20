
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  // Store processed URL to prevent unnecessary re-processing
  const [finalMediaItem, setFinalMediaItem] = useState<any>(null);
  
  // Process the media item only when mediaUrl changes
  useEffect(() => {
    if (!mediaUrl) {
      setFinalMediaItem(null);
      return;
    }
    
    const type = mediaType === 'video' 
      ? MediaType.VIDEO 
      : mediaType === 'gif'
        ? MediaType.GIF
        : MediaType.IMAGE;
        
    const item = {
      url: mediaUrl,
      type: type
    };
    
    setFinalMediaItem(item);
  }, [mediaUrl, mediaType]);
  
  if (!mediaUrl || !finalMediaItem) return null;

  return (
    <UniversalMedia
      item={finalMediaItem}
      className="w-full h-full object-cover"
      autoPlay={isHovering || mediaType === 'video'}
      controls={false}
      muted={true}
      loop={true}
    />
  );
};
