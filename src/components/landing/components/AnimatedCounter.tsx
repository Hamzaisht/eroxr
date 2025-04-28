
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface AnimatedCounterProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
  threshold?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

export const AnimatedCounter = ({
  endValue,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
  formatter = (value: number) => Math.round(value).toLocaleString(),
  threshold = 0.1,
  easing = (t: number) => 1 - Math.pow(1 - t, 3), // cubic ease out
  onComplete
}: AnimatedCounterProps) => {
  const [ref, isInView] = useIntersectionObserver<HTMLSpanElement>({
    threshold,
    triggerOnce: true,
    rootMargin: '50px'
  });
  
  const hasAnimated = useRef(false);
  const [displayValue, setDisplayValue] = useState('0');
  
  // Use requestAnimationFrame for smoother animation
  useEffect(() => {
    // Only animate if in view and hasn't animated yet
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      let startTime: number | null = null;
      const startValue = 0;
      
      // Animation function using requestAnimationFrame for better performance
      const animate = (timestamp: number) => {
        // Initialize start time on first call
        if (!startTime) startTime = timestamp;
        
        // Calculate elapsed time
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing function
        const easedProgress = easing(progress);
        
        // Calculate current value
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        
        // Update display value
        setDisplayValue(formatter(currentValue));
        
        // Continue animation if not complete
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(formatter(endValue));
          if (onComplete) onComplete();
        }
      };
      
      // Start animation
      requestAnimationFrame(animate);
    }
  }, [isInView, endValue, duration, formatter, easing, onComplete]);
  
  // Use CSS will-change to optimize rendering
  return (
    <span 
      ref={ref} 
      className={`font-display font-bold tracking-tight ${className}`}
      style={{ willChange: 'contents' }}
    >
      {prefix}{displayValue}{suffix}
    </span>
  );
};
