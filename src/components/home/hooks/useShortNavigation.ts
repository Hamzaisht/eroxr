
import { useState, useCallback } from "react";

interface UseShortNavigationProps {
  currentVideoIndex: number;
  setCurrentVideoIndex: (index: number) => void;
  totalShorts: number;
  setIsMuted?: (isMuted: boolean) => void;
}

export const useShortNavigation = ({
  currentVideoIndex,
  setCurrentVideoIndex,
  totalShorts,
  setIsMuted
}: UseShortNavigationProps) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleScroll = useCallback((e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentVideoIndex < totalShorts - 1) {
      // Scrolling down
      setCurrentVideoIndex(currentVideoIndex + 1);
      if (setIsMuted) setIsMuted(false);
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      // Scrolling up
      setCurrentVideoIndex(currentVideoIndex - 1);
      if (setIsMuted) setIsMuted(false);
    }
  }, [currentVideoIndex, totalShorts, setCurrentVideoIndex, setIsMuted]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY === null) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const threshold = 50; // Minimum swipe distance to trigger a change
    
    if (diff > threshold && currentVideoIndex < totalShorts - 1) {
      // Swipe up
      setCurrentVideoIndex(currentVideoIndex + 1);
      if (setIsMuted) setIsMuted(false);
    } else if (diff < -threshold && currentVideoIndex > 0) {
      // Swipe down
      setCurrentVideoIndex(currentVideoIndex - 1);
      if (setIsMuted) setIsMuted(false);
    }
    
    setTouchStartY(null);
  }, [touchStartY, currentVideoIndex, totalShorts, setCurrentVideoIndex, setIsMuted]);

  return {
    handleScroll,
    handleTouchStart,
    handleTouchEnd
  };
};
