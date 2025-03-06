import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from './types/dating';
import { VideoProfileCard } from './video-profile-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoProfileCarouselProps {
  ads: DatingAd[];
}

export const VideoProfileCarousel = ({ ads }: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < ads.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-neon-glow opacity-10"></div>
      
      <div 
        ref={containerRef}
        className="relative h-full flex items-center"
      >
        <AnimatePresence mode="popLayout">
          <div className="absolute inset-0 flex items-center justify-center">
            {ads.map((ad, index) => (
              <motion.div
                key={ad.id}
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
                <VideoProfileCard ad={ad} isActive={index === currentIndex} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className={cn(
            "absolute left-6 z-20 p-4 rounded-full",
            "bg-luxury-dark/50 backdrop-blur-md border border-luxury-primary/20",
            "text-luxury-primary hover:text-white transition-colors",
            "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
            "group"
          )}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className={cn(
            "absolute right-6 z-20 p-4 rounded-full",
            "bg-luxury-dark/50 backdrop-blur-md border border-luxury-primary/20",
            "text-luxury-primary hover:text-white transition-colors",
            "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
            "group"
          )}
          disabled={currentIndex === ads.length - 1}
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </motion.button>

        {/* Progress Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-luxury-primary w-6" 
                  : "bg-luxury-primary/30 hover:bg-luxury-primary/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
