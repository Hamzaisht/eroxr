
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '../../../types/dating';
import { AdActions } from './AdActions';
import { UserInfo } from './UserInfo';
import { AdStats } from './AdStats';
import { AdTags } from './AdTags';
import { VideoThumbnail } from '../VideoThumbnail';
import { cn } from '@/lib/utils';

interface AdCardProps {
  ad: DatingAd;
  onSelect: (ad: DatingAd) => void;
  isMobile: boolean;
}

export const AdCard = ({ ad, onSelect, isMobile }: AdCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-luxury-dark/40 backdrop-blur-sm",
        "border border-luxury-primary/10",
        "transition-all duration-300",
        "hover:border-luxury-primary/30",
        "hover:shadow-[0_0_20px_rgba(155,135,245,0.15)]"
      )}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => onSelect(ad)}
    >
      <div className="relative aspect-video">
        <VideoThumbnail 
          videoUrl={ad.video_url} 
          isHovered={isHovered}
          isMobile={isMobile}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <AdActions ad={ad} />
      </div>

      <div className="p-4 space-y-4">
        <UserInfo ad={ad} />
        <AdStats ad={ad} />
        <AdTags ad={ad} />
      </div>

      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-luxury-dark to-transparent opacity-0",
        "group-hover:opacity-100 transition-opacity duration-300"
      )} />
    </motion.div>
  );
};
