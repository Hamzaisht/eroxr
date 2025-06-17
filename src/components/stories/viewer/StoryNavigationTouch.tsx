
import { useRef, useCallback } from "react";

interface StoryNavigationTouchProps {
  onNext: () => void;
  onPrevious: () => void;
  onPause: () => void;
  onResume: () => void;
  className?: string;
}

export const StoryNavigationTouch = ({
  onNext,
  onPrevious,
  onPause,
  onResume,
  className = ""
}: StoryNavigationTouchProps) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const mouseDownTime = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();

    // Start long press timer for pause
    longPressTimer.current = setTimeout(() => {
      onPause();
    }, 200);
  }, [onPause]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Clear long press timer on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchDuration = Date.now() - touchStartTime.current;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Resume if we were paused
    onResume();

    // Horizontal swipe detection
    if (absDeltaX > 50 && absDeltaX > absDeltaY && touchDuration < 500) {
      if (deltaX > 0) {
        onPrevious(); // Swipe right = previous
      } else {
        onNext(); // Swipe left = next
      }
      return;
    }

    // Tap detection (short touch with minimal movement)
    if (absDeltaX < 10 && absDeltaY < 10 && touchDuration < 300) {
      const screenWidth = window.innerWidth;
      const tapX = touchEndX;

      if (tapX < screenWidth * 0.3) {
        onPrevious(); // Left side tap = previous
      } else if (tapX > screenWidth * 0.7) {
        onNext(); // Right side tap = next
      }
    }
  }, [onNext, onPrevious, onResume]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownTime.current = Date.now();
    isMouseDown.current = true;

    // Start long press timer for pause (like touch)
    longPressTimer.current = setTimeout(() => {
      onPause();
    }, 200);
  }, [onPause]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (!isMouseDown.current) return;
    isMouseDown.current = false;

    const clickDuration = Date.now() - mouseDownTime.current;
    
    // Resume if we were paused
    onResume();

    // Only handle quick clicks (not long holds)
    if (clickDuration < 300) {
      const screenWidth = window.innerWidth;
      const clickX = e.clientX;

      if (clickX < screenWidth * 0.3) {
        onPrevious(); // Left side click = previous
      } else if (clickX > screenWidth * 0.7) {
        onNext(); // Right side click = next
      }
    }
  }, [onNext, onPrevious, onResume]);

  const handleMouseLeave = useCallback(() => {
    // Clear long press timer if mouse leaves
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    isMouseDown.current = false;
  }, []);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual feedback areas */}
      <div className="absolute inset-y-0 left-0 w-1/3 flex items-center justify-start pl-4 pointer-events-none">
        <div className="w-2 h-12 bg-white/20 rounded-full opacity-0 transition-opacity" />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/3 flex items-center justify-end pr-4 pointer-events-none">
        <div className="w-2 h-12 bg-white/20 rounded-full opacity-0 transition-opacity" />
      </div>
      
      {/* Invisible click zones for better UX indication */}
      <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer hover:bg-white/5 transition-colors" />
      <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer hover:bg-white/5 transition-colors" />
    </div>
  );
};
