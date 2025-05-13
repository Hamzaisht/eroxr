
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';

interface VideoProfileCarouselProps {
  ads: DatingAd[];
}

export const VideoProfileCarousel = ({ ads }: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.6,
  });

  // Reset the current index when ads change
  useEffect(() => {
    setCurrentIndex(0);
  }, [ads]);

  // Start/stop playing based on visibility
  useEffect(() => {
    if (inView) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [inView]);

  // If no ads, return nothing
  if (!ads || ads.length === 0) {
    return (
      <div className="relative aspect-[4/3] md:aspect-video w-full max-w-4xl mx-auto bg-luxury-darker/50 rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-luxury-neutral text-center p-4">No profiles available at the moment.</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
  };

  return (
    <div 
      ref={ref}
      className="relative aspect-[4/3] md:aspect-video w-full max-w-4xl mx-auto bg-luxury-darker/30 rounded-xl overflow-hidden shadow-2xl"
    >
      {/* Profile Cards */}
      <CarouselContainer 
        ads={ads} 
        currentIndex={currentIndex} 
        isActive={isPlaying} 
      />
      
      {/* Navigation Controls */}
      <div className="absolute bottom-0 inset-x-0 flex justify-between p-4 z-20">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
