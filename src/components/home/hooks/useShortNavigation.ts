
import { useEffect, useRef } from "react";

interface UseShortNavigationProps {
  currentVideoIndex: number;
  setCurrentVideoIndex: (index: number) => void;
  totalShorts: number;
  setIsMuted?: (value: boolean) => void;
}

export const useShortNavigation = ({
  currentVideoIndex,
  setCurrentVideoIndex,
  totalShorts,
  setIsMuted
}: UseShortNavigationProps) => {
  const touchStartY = useRef<number>(0);

  const handleScroll = (event: React.WheelEvent) => {
    event.preventDefault();
    
    if (event.deltaY > 0 && currentVideoIndex < totalShorts - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (event.deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    if (deltaY > 50 && currentVideoIndex < totalShorts - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } 
    else if (deltaY < -50 && currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(currentVideoIndex - 1);
      } else if (event.key === 'ArrowDown' && currentVideoIndex < totalShorts - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else if (event.key === 'm' && setIsMuted) {
        setIsMuted(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, totalShorts, setCurrentVideoIndex, setIsMuted]);

  return {
    handleScroll,
    handleTouchStart,
    handleTouchEnd
  };
};
