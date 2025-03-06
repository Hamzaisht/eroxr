
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '../types/dating';
import { VideoContent } from './VideoContent';
import { ProfileBadges } from './ProfileBadges';
import { ProfileInfo } from './ProfileInfo';
import { AdActions } from './AdActions';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
}

export const VideoProfileCard = ({ 
  ad, 
  isActive = false, 
  isPreviewMode = false,
  onClick
}: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="w-full max-w-4xl rounded-xl overflow-hidden relative glass-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: isPreviewMode ? 1 : 1.02 }}
      onClick={onClick}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* Premium Badge */}
      <ProfileBadges ad={ad} />
      
      {/* Edit/Delete Actions */}
      <AdActions ad={ad} />
      
      {/* Video Content */}
      <VideoContent 
        ad={ad} 
        isActive={isActive} 
        isHovered={isHovered} 
      />
      
      {/* Profile Information */}
      <ProfileInfo ad={ad} isPreviewMode={isPreviewMode} />
    </motion.div>
  );
};
