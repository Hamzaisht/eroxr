
import { useRef } from "react";

interface StoryNavigationTouchProps {
  onNext: () => void;
  onPrevious: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const StoryNavigationTouch = ({
  onNext,
  onPrevious,
  onPause,
  onResume,
}: StoryNavigationTouchProps) => {
  const touchStartX = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    onPause();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const diff = touchStartX.current - touchEndX;
    const timeDiff = touchEndTime - touchStartTime.current;

    onResume();

    // Only register as swipe if it was quick and significant
    if (timeDiff < 300 && Math.abs(diff) > 50) {
      if (diff > 0) {
        onNext();
      } else {
        onPrevious();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default to avoid text selection
    e.preventDefault();
    onPause();
  };

  const handleMouseUp = () => {
    onResume();
  };

  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrevious();
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  };

  return (
    <div className="absolute inset-0 z-30 flex">
      {/* Left side - Previous */}
      <div 
        className="flex-1 cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleLeftClick}
      />
      
      {/* Right side - Next */}
      <div 
        className="flex-1 cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleRightClick}
      />
    </div>
  );
};
