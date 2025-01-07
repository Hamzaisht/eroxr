import { motion } from "framer-motion";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  if (!mediaUrl) return null;

  const commonProps = {
    key: mediaUrl, // Add key to force re-render when URL changes
    className: "w-full h-full object-cover",
  };

  return mediaType === 'video' ? (
    <video
      {...commonProps}
      src={mediaUrl}
      autoPlay
      loop
      muted
      playsInline
    />
  ) : (
    <img
      {...commonProps}
      src={mediaUrl}
      alt="Profile Banner"
    />
  );
};