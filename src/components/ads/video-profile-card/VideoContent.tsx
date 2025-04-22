
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatingAd } from '../types/dating';
import { UniversalMedia } from '@/components/media/UniversalMedia';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
  isAnimation?: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered, isAnimation = false }: VideoContentProps) => {
  const variants = {
    idle: { scale: 1.01, opacity: 0.9 },
    active: { scale: 1, opacity: 1 }
  };

  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      {ad.video_url ? (
        <motion.div 
          className="w-full h-full flex items-center justify-center"
          variants={isAnimation ? variants : undefined}
          initial="idle"
          animate={(isActive || isHovered) ? "active" : "idle"}
          transition={{ duration: 0.5 }}
        >
          <UniversalMedia
            item={ad}
            className={cn(
              "w-full h-full object-cover"
            )}
            autoPlay={isHovered || isActive}
            controls={false}
          />
          
          {/* Overlay for animation effects */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
            animate={{ 
              opacity: (isActive || isHovered) ? 0.3 : 0.5
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
          <Video className="w-16 h-16 text-luxury-neutral/30" />
        </div>
      )}
    </div>
  );
};
