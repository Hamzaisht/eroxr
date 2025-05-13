
import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatingAd } from '../types/dating';
import { CarouselContainer } from './CarouselContainer';
import { CarouselControls } from './CarouselControls';
import { CarouselEmpty } from './CarouselEmpty';
import { Button } from '@/components/ui/button';
import { useInView } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

interface VideoProfileCarouselProps {
  limit?: number;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
  userId?: string;
  emptyMessage?: string;
  onProfileClick?: (ad: DatingAd) => void;
}

export const VideoProfileCarousel = ({
  limit = 10,
  autoplay = true,
  showControls = true,
  className,
  userId,
  emptyMessage = "No dating profiles found",
  onProfileClick
}: VideoProfileCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const { isReducedMotion } = useSettings();
  
  // Determine if carousel should be active (in view and not paused)
  const isActive = isInView && !isPaused && !isReducedMotion && autoplay;

  // Fetch dating ads
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['datingAds', limit, userId],
    queryFn: async () => {
      let query = supabase
        .from('dating_ads')
        .select('*')
        .eq('is_active', true)
        .eq('moderation_status', 'approved')
        .order('last_active', { ascending: false })
        .limit(limit);
        
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as DatingAd[];
    },
  });
  
  // Navigation control handlers
  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === ads.length - 1 ? 0 : prevIndex + 1
    );
  }, [ads.length]);
  
  const handlePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1
    );
  }, [ads.length]);
  
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const handlePlay = useCallback(() => {
    setIsPaused(false);
  }, []);
  
  // Auto advance carousel
  useEffect(() => {
    if (!isActive || ads.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 8000); // Advance every 8 seconds
    
    return () => clearInterval(interval);
  }, [isActive, ads.length, handleNext]);
  
  // Set playing state based on view status
  useEffect(() => {
    setIsPlaying(isActive);
  }, [isActive]);
  
  // Handle profile click
  const handleProfileClick = (ad: DatingAd) => {
    if (onProfileClick) {
      onProfileClick(ad);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-destructive">Failed to load dating profiles</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  // Empty state
  if (!ads || ads.length === 0) {
    return <CarouselEmpty message={emptyMessage} />;
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full aspect-[9/16] max-w-4xl mx-auto overflow-hidden rounded-xl glass-card",
        className
      )}
    >
      <CarouselContainer 
        ads={ads}
        currentIndex={currentIndex}
        isActive={isActive}
      />
      
      {showControls && (
        <CarouselControls
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPause={handlePause}
          onPlay={handlePlay}
          isPaused={isPaused}
          currentIndex={currentIndex}
          totalCount={ads.length}
          onProfileClick={() => handleProfileClick(ads[currentIndex])}
        />
      )}
    </div>
  );
};
