
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';

// Create stub components for the missing imports
const CarouselControls = ({ onNext, onPrev, currentIndex, total }: any) => (
  <div className="flex justify-between w-full px-4">
    <button onClick={onPrev}>Previous</button>
    <div>
      {currentIndex + 1} / {total}
    </div>
    <button onClick={onNext}>Next</button>
  </div>
);

const CarouselEmpty = () => (
  <div className="flex justify-center items-center h-[50vh]">
    <p>No profiles available</p>
  </div>
);

// Create a stub for useSettings
const useSettings = () => ({
  settings: {
    enableVideoAutoplay: true
  }
});

interface VideoProfileCarouselProps {
  ads: DatingAd[];
  autoPlay?: boolean;
  className?: string;
}

export const VideoProfileCarousel = ({ 
  ads = [],
  autoPlay = true,
  className = ""
}: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { settings } = useSettings();

  const handleNext = () => {
    if (ads.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    if (ads.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Reset to the first item when ads change
    setCurrentIndex(0);
  }, [ads]);

  useEffect(() => {
    // Set active state based on autoplay setting or prop
    setIsActive(autoPlay && settings.enableVideoAutoplay);
  }, [autoPlay, settings.enableVideoAutoplay]);

  // Return empty state if no ads
  if (!ads || ads.length === 0) {
    return <CarouselEmpty />;
  }

  return (
    <motion.div 
      className={`relative w-full overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Carousel Content */}
      <CarouselContainer 
        ads={ads} 
        currentIndex={currentIndex} 
        isActive={isActive}
      />
      
      {/* Carousel Controls */}
      <CarouselControls 
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={currentIndex}
        total={ads.length}
      />
    </motion.div>
  );
};
