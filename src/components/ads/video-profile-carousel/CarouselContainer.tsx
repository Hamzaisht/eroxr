
"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from '@/types/dating';
import { AlertCircle } from 'lucide-react';

interface CarouselContainerProps {
  ads: DatingAd[];
  currentIndex: number;
  isActive: boolean;
}

export const CarouselContainer = ({ ads, currentIndex, isActive }: CarouselContainerProps) => {
  // Handle edge cases to prevent errors
  if (!ads || ads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-luxury-neutral mx-auto mb-2" />
          <p className="text-luxury-neutral">No content available</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="absolute inset-0 flex items-center justify-center">
        {ads.map((ad, index) => {
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
              <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-luxury-neutral mx-auto mb-2" />
                  <p className="text-luxury-neutral">Content coming soon</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default CarouselContainer;
