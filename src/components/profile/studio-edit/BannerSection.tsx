
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { ProfileAvatarImage } from "../avatar/AvatarImage";

interface BannerSectionProps {
  profile: any;
  onBannerClick: () => void;
  onAvatarClick: () => void;
  isUploading: boolean;
}

export const BannerSection = ({ profile, onBannerClick, onAvatarClick, isUploading }: BannerSectionProps) => {
  return (
    <div className="relative mx-8 mb-6">
      <motion.div 
        className="relative h-40 rounded-2xl overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {profile.banner_url ? (
          profile.banner_url.includes('.mp4') || profile.banner_url.includes('.webm') || profile.banner_url.includes('.mov') ? (
            <video 
              src={profile.banner_url} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover" 
            />
          ) : (
            <img src={profile.banner_url} alt="Divine Banner" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-luxury-primary/20 via-luxury-accent/10 to-luxury-primary/20 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/60 via-transparent to-luxury-dark/20" />
        
        <motion.div 
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
          whileHover={{ backdropFilter: "blur(8px)" }}
        >
          <Button
            variant="ghost"
            onClick={onBannerClick}
            disabled={isUploading}
            className="text-white hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 px-6 py-3"
          >
            <Camera className="w-5 h-5 mr-2" />
            Change Divine Banner
          </Button>
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-8 left-6 group/avatar"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-luxury-dark shadow-2xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Divine Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 flex items-center justify-center">
                <Camera className="w-8 h-8 text-luxury-neutral/60" />
              </div>
            )}
            <motion.div 
              className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={onAvatarClick}
              whileHover={{ backdropFilter: "blur(4px)" }}
            >
              <Camera className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full bg-luxury-primary/30 blur-xl -z-10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
