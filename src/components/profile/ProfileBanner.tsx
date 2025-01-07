import { motion } from "framer-motion";
import { useState } from "react";
import { Image } from "lucide-react";

interface ProfileBannerProps {
  profile: any;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  isOwnProfile?: boolean;
}

export const ProfileBanner = ({ profile, getMediaType, isOwnProfile }: ProfileBannerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const bannerMediaType = getMediaType(profile?.banner_url);

  const handleBannerClick = () => {
    if (isOwnProfile) {
      document.getElementById('banner-upload')?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("Banner file selected:", file);
    }
  };

  return (
    <motion.div 
      className="h-[60vh] w-full overflow-hidden relative cursor-pointer group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={handleBannerClick}
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

      {isOwnProfile && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-30">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="text-white flex flex-col items-center gap-2"
          >
            <Image className="w-12 h-12 animate-pulse" />
            <span className="text-lg font-medium">Change Banner</span>
          </motion.div>
        </div>
      )}

      <input
        type="file"
        id="banner-upload"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
    </motion.div>
  );
};