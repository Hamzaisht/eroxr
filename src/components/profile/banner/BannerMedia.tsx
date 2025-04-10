
import { motion } from "framer-motion";
import { UniversalMedia } from "@/components/media/UniversalMedia";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  if (!mediaUrl) return null;

  const mediaItem = {
    media_url: mediaType === 'image' || mediaType === 'gif' ? mediaUrl : null,
    video_url: mediaType === 'video' ? mediaUrl : null,
    media_type: mediaType,
  };

  return (
    <UniversalMedia
      item={mediaItem}
      className="w-full h-full object-cover"
      autoPlay={isHovering || mediaType === 'video'}
      controls={false}
    />
  );
};
