
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
        {ads.map((ad, index) => {
          // Ensure all required props are present with proper defaults for DatingAd
          const enrichedAd: DatingAd = {
            ...ad,
            tags: ad.tags || [],
            isPremium: ad.is_premium !== undefined ? ad.is_premium : ad.isPremium || false,
            isVerified: ad.is_verified !== undefined ? ad.is_verified : ad.isVerified || false,
            avatarUrl: ad.avatarUrl || ad.avatar_url || "",
            videoUrl: ad.videoUrl || ad.video_url || "",
            location: ad.location || "Unknown location", // Ensure location is provided
            age: ad.age || 25, // Default age
            views: ad.views || ad.view_count || 0 // Ensure views is provided
          };
          
          return (
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
                ad={enrichedAd} 
                isActive={index === currentIndex && isActive}
                isAnimation={true}
              />
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};
