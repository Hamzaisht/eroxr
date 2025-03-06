
import { useState, useRef } from 'react';
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';
import { CarouselNavigation } from './CarouselNavigation';
import { CarouselProgressIndicator } from './CarouselProgressIndicator';

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

  const handleGoToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-dark/80 to-luxury-darker/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-neon-glow opacity-10"></div>
      
      <div 
        ref={containerRef}
        className="relative h-full flex items-center"
      >
        <CarouselContainer 
          ads={ads} 
          currentIndex={currentIndex} 
          isActive={true} 
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
      </div>
    </div>
  );
};
