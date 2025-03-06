
import { motion } from "framer-motion";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { EmptyProfilesState } from "./EmptyProfilesState";

interface DatingContentProps {
  ads: DatingAd[] | undefined;
  canAccessBodyContact: boolean;
  onAdCreationSuccess: () => void;
}

export const DatingContent = ({ 
  ads, 
  canAccessBodyContact, 
  onAdCreationSuccess 
}: DatingContentProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex-1"
    >
      {ads && ads.length > 0 ? (
        <VideoProfileCarousel ads={ads} />
      ) : (
        <EmptyProfilesState 
          canAccessBodyContact={canAccessBodyContact}
          onAdCreationSuccess={onAdCreationSuccess}
        />
      )}
    </motion.div>
  );
};
