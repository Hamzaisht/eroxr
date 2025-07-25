
import { motion } from "framer-motion";
import { AdActions } from "./grid-item/AdActions";
import { UserInfo } from "./grid-item/UserInfo";
import { AdStats } from "./grid-item/AdStats";
import { AdTags } from "./grid-item/AdTags";
import { VideoThumbnail } from "./VideoThumbnail";
import { DatingAd } from "../../types/dating";
import { calculateMatchPercentage, getMatchLabel } from "@/components/dating/utils/matchCalculator";

export interface GridItemProps {
  ad: DatingAd;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (ad: DatingAd) => void;
  onMediaClick?: (url: string) => void;
  onTagClick?: (tag: string, e: React.MouseEvent) => void;
  isMobile: boolean;
  userProfile?: DatingAd | null;
}

export const GridItem = ({ 
  ad, 
  isHovered, 
  onHover, 
  onSelect, 
  onMediaClick, 
  onTagClick,
  isMobile,
  userProfile
}: GridItemProps) => {
  // Calculate match percentage if user profile is available
  const matchPercentage = userProfile ? calculateMatchPercentage(userProfile, ad) : null;
  const matchInfo = matchPercentage ? getMatchLabel(matchPercentage) : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      className="dating-glass-panel dating-card-hover rounded-xl overflow-hidden shadow-lg border border-luxury-primary/10 cursor-pointer group relative flex flex-col will-change-transform gpu-accelerated"
      onClick={() => onSelect(ad)}
      onMouseEnter={() => !isMobile && onHover(ad.id)}
      onMouseLeave={() => !isMobile && onHover(null)}
      onTouchStart={() => isMobile && onHover(isHovered ? null : ad.id)}
    >
      <div className="aspect-video w-full relative">
        <VideoThumbnail 
          videoUrl={ad.video_url} 
          isHovered={isHovered}
          isMobile={isMobile}
        />
        
        {/* Action Buttons - positioned over the video */}
        <AdActions ad={ad} />
        
        {/* Match percentage badge */}
        {matchInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-2 left-2 z-10"
          >
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              matchPercentage && matchPercentage >= 80 ? 'high-match' :
              matchPercentage && matchPercentage >= 60 ? 'medium-match' : 'low-match'
            }`}>
              ⚡ {matchPercentage}% Match
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <UserInfo ad={ad} />
        <AdStats ad={ad} />
        <AdTags ad={ad} onTagClick={onTagClick} />
        
        {/* Enhanced Last active indicator */}
        {ad.last_active && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-xs text-luxury-neutral mt-2"
          >
            <div className="h-2 w-2 rounded-full status-online"></div>
            <span>Active recently</span>
          </motion.div>
        )}
      </div>
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};
