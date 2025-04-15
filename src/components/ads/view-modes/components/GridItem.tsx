
import { motion } from "framer-motion";
import type { GridItemProps } from "../types";
import { AdActions } from "./grid-item/AdActions";
import { UserInfo } from "./grid-item/UserInfo";
import { AdStats } from "./grid-item/AdStats";
import { AdTags } from "./grid-item/AdTags";
import { VideoThumbnail } from "./VideoThumbnail";

export const GridItem = ({ 
  ad, 
  isHovered, 
  onHover, 
  onSelect, 
  onMediaClick, 
  onTagClick,
  isMobile 
}: GridItemProps) => {
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
      <AdActions ad={ad} />
      
      <div className="aspect-video w-full relative">
        <VideoThumbnail 
          videoUrl={ad.video_url} 
          isHovered={isHovered}
          isMobile={isMobile}
        />
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <UserInfo ad={ad} />
        <AdStats ad={ad} />
        <AdTags ad={ad} onTagClick={onTagClick} />
      </div>
    </motion.div>
  );
};
