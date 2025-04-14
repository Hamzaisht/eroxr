
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UniversalMedia } from "@/components/media/UniversalMedia";

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
    
    const item = {
      media_url: mediaType === 'image' || mediaType === 'gif' ? mediaUrl : null,
      video_url: mediaType === 'video' ? mediaUrl : null,
      media_type: mediaType,
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
