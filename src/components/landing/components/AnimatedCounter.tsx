
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useCounterAnimation } from '@/hooks/use-counter-animation';

interface AnimatedCounterProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter = ({
  endValue,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
  formatter = (value: number) => Math.round(value).toLocaleString()
}: AnimatedCounterProps) => {
  const [ref, isInView] = useIntersectionObserver<HTMLSpanElement>({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const hasAnimated = useRef(false);
  const { displayValue } = useCounterAnimation(isInView && !hasAnimated.current ? endValue : 0, {
    duration,
    formatter
  });
  
  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
    }
  }, [isInView]);
  
  return (
    <span ref={ref} className={`font-display font-bold tracking-tight ${className}`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};
