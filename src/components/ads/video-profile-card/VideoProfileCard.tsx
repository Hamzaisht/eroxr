
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '../types/dating';
import { VideoContent } from './VideoContent';
import { ProfileBadges } from './ProfileBadges';
import { ProfileInfo } from './ProfileInfo';

interface VideoProfileCardProps {
  ad: DatingAd;
  isActive?: boolean;
}

export const VideoProfileCard = ({ ad, isActive = false }: VideoProfileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="w-full max-w-4xl rounded-xl overflow-hidden relative glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* Premium Badge */}
      <ProfileBadges ad={ad} />
      
      {/* Video Content */}
      <VideoContent 
        ad={ad} 
        isActive={isActive} 
        isHovered={isHovered} 
      />
      
      {/* Profile Information */}
      <ProfileInfo ad={ad} />
    </motion.div>
  );
};
