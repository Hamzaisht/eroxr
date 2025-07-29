import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { cn } from '@/lib/utils';

interface SwipeControllerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  enabled?: boolean;
  threshold?: number;
}

export const SwipeController = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  enabled = true,
  threshold = 50
}: SwipeControllerProps) => {
  const { ref, isGestureActive } = useSwipeGestures({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold,
    enabled
  });

  return (
    <motion.div
      ref={ref as any}
      className={cn(
        'relative touch-optimized',
        isGestureActive && 'cursor-grabbing select-none',
        className
      )}
      style={{
        touchAction: enabled ? 'pan-y' : 'auto'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {/* Visual feedback for gestures */}
      <AnimatePresence>
        {isGestureActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none bg-luxury-primary/5 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};