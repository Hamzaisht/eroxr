
import { useState, useCallback, useEffect } from 'react';

interface CounterOptions {
  duration?: number;
  easing?: (t: number) => number;
  delay?: number;
  formatter?: (value: number) => string;
}

export const useCounterAnimation = (
  endValue: number,
  options: CounterOptions = {}
) => {
  const {
    duration = 2000,
    easing = (t: number) => 1 - Math.pow(1 - t, 3),
    delay = 0,
    formatter = (value: number) => Math.round(value).toLocaleString()
  } = options;
  
  const [count, setCount] = useState(0);
  
  const animate = useCallback(() => {
    const start = 0;
    const startTime = performance.now();
    
    const updateCount = (currentTime: number) => {
      let elapsedTime = currentTime - startTime;
      
      if (elapsedTime < delay) {
        requestAnimationFrame(updateCount);
        return;
      }
      
      elapsedTime -= delay;
      
      if (elapsedTime < duration) {
        const progress = easing(elapsedTime / duration);
        const nextCount = start + progress * (endValue - start);
        setCount(nextCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [endValue, duration, easing, delay]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      animate();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [animate]);
  
  return {
    value: count,
    displayValue: formatter(count)
  };
};
