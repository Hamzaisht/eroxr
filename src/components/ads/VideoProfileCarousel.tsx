import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatingAd } from './types/dating';
import { VideoProfileCard } from './VideoProfileCard';
import { ChevronLeft, ChevronRight, Play, Video } from 'lucide-react';
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
    <div className="relative w-full h-[85vh] overflow-hidden bg-luxury-dark/50 backdrop-blur-xl rounded-2xl">
      <div className="absolute inset-0 bg-neon-glow opacity-20" />
      
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
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <VideoProfileCard ad={ad} isActive={index === currentIndex} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <button
          onClick={handlePrev}
          className={cn(
            "absolute left-4 z-20 p-3 rounded-full bg-luxury-dark/50 backdrop-blur-md",
            "text-luxury-primary hover:text-white transition-colors",
            "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
            "transform hover:scale-110 active:scale-95"
          )}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className={cn(
            "absolute right-4 z-20 p-3 rounded-full bg-luxury-dark/50 backdrop-blur-md",
            "text-luxury-primary hover:text-white transition-colors",
            "hover:bg-luxury-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
            "transform hover:scale-110 active:scale-95"
          )}
          disabled={currentIndex === ads.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};