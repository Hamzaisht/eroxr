import { motion } from "framer-motion";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  if (!mediaUrl) return null;

  return mediaType === 'video' ? (
    <video
      src={mediaUrl}
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  ) : (
    <img
      src={mediaUrl}
      alt="Profile Banner"
      className="w-full h-full object-cover"
    />
  );
};