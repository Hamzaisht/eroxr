import { motion } from "framer-motion";
import { useState } from "react";

interface ProfileBannerProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
}

export const ProfileBanner = ({ profile, getMediaType }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const bannerMediaType = getMediaType(profile?.banner_url);

  return (
    <motion.div 
      className="h-[60vh] w-full overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to opacity-90 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.1)_0%,transparent_70%)] animate-pulse z-20" />
      
      {bannerMediaType === 'video' ? (
        <video
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
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
          src={profile?.banner_url || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
          alt="Profile Banner"
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
            isHovering ? 'scale-105' : 'scale-100'
          }`}
        />
      )}
    </motion.div>
  );
};