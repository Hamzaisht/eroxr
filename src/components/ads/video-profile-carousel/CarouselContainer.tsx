
"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from '../types/dating';
import { VideoProfileCard } from '../video-profile-card';

interface CarouselContainerProps {
  ads: DatingAd[];
  currentIndex: number;
  isActive: boolean;
}

export const CarouselContainer = ({ ads, currentIndex, isActive }: CarouselContainerProps) => {
  // Handle edge cases to prevent errors
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="absolute inset-0 flex items-center justify-center">
        {ads.map((ad, index) => (
          <motion.div
            key={ad?.id || index}
            initial={{ scale: 0.8, opacity: 0, x: '100%' }}
            animate={{
              scale: index === currentIndex ? 1 : 0.8,
              opacity: index === currentIndex ? 1 : 0,
              x: `${(index - currentIndex) * 100}%`,
              zIndex: index === currentIndex ? 10 : 0,
            }}
            exit={{ scale: 0.8, opacity: 0, x: '-100%' }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="absolute w-full h-full flex items-center justify-center px-8"
          >
            <VideoProfileCard 
              ad={ad} 
              isActive={index === currentIndex && isActive}
              isAnimation={true}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
