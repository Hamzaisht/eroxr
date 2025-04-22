
import { useState, useRef, useEffect } from 'react';
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';
import { CarouselNavigation } from './CarouselNavigation';
import { CarouselProgressIndicator } from './CarouselProgressIndicator';
import { VideoControls } from '../video-profile-card/VideoControls';
import { useMediaQuery } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoProfileCarouselProps {
  ads: DatingAd[];
}

export const VideoProfileCarousel = ({ ads }: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, ads.length]);

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

  const handleGoToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl flex items-center justify-center">
        <p className="text-luxury-neutral">No profiles available at this time</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative w-full ${isFullscreen ? 'h-screen fixed inset-0 z-50' : 'h-[85vh]'} 
        overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl`}
    >
      <div className="absolute inset-0 bg-neon-glow opacity-10"></div>
      
      <div 
        ref={containerRef}
        className="relative h-full flex items-center"
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <CarouselContainer 
          ads={ads} 
          currentIndex={currentIndex} 
          isActive={isActive} 
        />

        <CarouselNavigation 
          onPrev={handlePrev} 
          onNext={handleNext} 
          hasPrev={currentIndex > 0} 
          hasNext={currentIndex < ads.length - 1} 
        />

        <CarouselProgressIndicator 
          totalSlides={ads.length} 
          currentIndex={currentIndex} 
          onSlideChange={handleGoToSlide} 
        />

        <VideoControls 
          videoUrl={ads[currentIndex]?.video_url || null}
          avatarUrl={ads[currentIndex]?.avatar_url || null}
          isActive={isActive}
        />
      </div>
    </motion.div>
  );
};
