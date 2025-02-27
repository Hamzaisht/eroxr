
import { motion } from "framer-motion";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  if (!mediaUrl) return null;

  if (mediaType === 'video') {
    return (
      <video
        key={mediaUrl} // Add key to force re-render when URL changes
        className="w-full h-full object-cover"
        src={mediaUrl}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <img
      key={mediaUrl} // Add key to force re-render when URL changes
      className="w-full h-full object-cover"
      src={mediaUrl}
      alt="Profile Banner"
    />
  );
};
