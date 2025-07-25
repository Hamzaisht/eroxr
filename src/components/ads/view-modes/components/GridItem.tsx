
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
      className="bg-luxury-dark/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-luxury-primary/10 cursor-pointer group relative flex flex-col"
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
          <div className="absolute bottom-2 left-2 z-10">
            <div className={`text-xs font-medium ${matchInfo.color} text-white px-2 py-1 rounded-md`}>
              {matchPercentage}% Match
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <UserInfo ad={ad} />
        <AdStats ad={ad} />
        <AdTags ad={ad} onTagClick={onTagClick} />
        
        {/* Last active indicator */}
        {ad.last_active && (
          <div className="flex items-center gap-1.5 text-xs text-luxury-neutral mt-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Active recently</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
