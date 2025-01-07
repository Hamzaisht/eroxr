import { motion } from "framer-motion";

interface BannerMediaProps {
  mediaUrl?: string;
  mediaType: 'video' | 'gif' | 'image';
  isHovering: boolean;
}

export const BannerMedia = ({ mediaUrl, mediaType, isHovering }: BannerMediaProps) => {
  const defaultBannerUrl = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81";
  const url = mediaUrl || defaultBannerUrl;

  return mediaType === 'video' ? (
    <video
      src={url}
      className={`w-full h-full object-cover transform transition-transform duration-700 ${
        isHovering ? 'scale-105' : 'scale-100'
      }`}
      autoPlay={isHovering}
      loop
      muted
      playsInline
    />
  ) : (
    <img
      src={url}
      alt="Profile Banner"
      className={`w-full h-full object-cover transform transition-transform duration-700 ${
        isHovering ? 'scale-105' : 'scale-100'
      }`}
    />
  );
};