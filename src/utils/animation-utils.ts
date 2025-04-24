
import { useEffect, useState, useCallback } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * Hook for creating smooth parallax scroll effects
 */
export const useParallax = (
  strength: number = 100, 
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
) => {
  const scrollY = useMotionValue(0);
  
  // Update scroll position
  useEffect(() => {
    const updateScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    
    return () => window.removeEventListener('scroll', updateScroll);
  }, [scrollY]);
  
  // Create transform based on direction
  let transform;
  switch (direction) {
    case 'up':
      transform = useTransform(scrollY, [0, strength], [0, -strength]);
      break;
    case 'down':
      transform = useTransform(scrollY, [0, strength], [0, strength]);
      break;
    case 'left':
      transform = useTransform(scrollY, [0, strength], [0, -strength]);
      break;
    case 'right':
      transform = useTransform(scrollY, [0, strength], [0, strength]);
      break;
  }
  
  return {
    y: direction === 'up' || direction === 'down' ? transform : undefined,
    x: direction === 'left' || direction === 'right' ? transform : undefined,
  };
};

/**
 * Hook for creating smooth mouse parallax effects
 */
export const useMouseParallax = (
  sensitivity: number = 0.05,
  damping: number = 50
) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth movement
  const x = useSpring(mouseX, { stiffness: 400, damping });
  const y = useSpring(mouseY, { stiffness: 400, damping });
  
  // Mouse move handler with optimized performance
  useEffect(() => {
    let requestId: number | null = null;
    let mouse = { x: 0, y: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Store mouse position
      mouse = {
        x: (e.clientX - window.innerWidth / 2) * sensitivity,
        y: (e.clientY - window.innerHeight / 2) * sensitivity
      };
      
      // Request animation frame if not already requested
      if (!requestId) {
        requestId = requestAnimationFrame(updateMousePosition);
      }
    };
    
    const updateMousePosition = () => {
      mouseX.set(mouse.x);
      mouseY.set(mouse.y);
      requestId = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, [mouseX, mouseY, sensitivity]);
  
  return { x, y };
};

/**
 * Creates an optimized typing animation effect
 */
export const useTypingEffect = (
  text: string,
  options: {
    speed?: number;
    delay?: number;
    cursor?: boolean;
    loop?: boolean;
    onComplete?: () => void;
  } = {}
) => {
  const {
    speed = 50,
    delay = 0,
    cursor = true,
    loop = false,
    onComplete
  } = options;
  
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  // Reset animation when text changes
  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
  }, [text]);
  
  // Run typing animation
  useEffect(() => {
    let timeout: number;
    let charIndex = 0;
    
    const startTyping = () => {
      setIsTyping(true);
      
      timeout = window.setTimeout(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.substring(0, charIndex + 1));
          charIndex++;
          timeout = window.setTimeout(startTyping, speed);
        } else {
          setIsTyping(false);
          setIsDone(true);
          
          if (onComplete) {
            onComplete();
          }
          
          if (loop) {
            // Reset for next loop
            timeout = window.setTimeout(() => {
              setDisplayedText('');
              charIndex = 0;
              startTyping();
            }, 2000);
          }
        }
      }, charIndex === 0 ? delay : speed);
    };
    
    startTyping();
    
    return () => clearTimeout(timeout);
  }, [text, speed, delay, loop, onComplete]);
  
  return {
    text: displayedText,
    isTyping,
    isDone,
    cursor: cursor && isTyping,
    element: cursor ? (
      <span>
        {displayedText}
        {(isTyping || (!isDone && displayedText === '')) && (
          <span className="animate-cursor">|</span>
        )}
      </span>
    ) : displayedText
  };
};

/**
 * Creates smooth counter animation
 */
export const useCounterAnimation = (
  endValue: number,
  options: {
    duration?: number;
    easing?: (t: number) => number;
    delay?: number;
    formatter?: (value: number) => string;
  } = {}
) => {
  const {
    duration = 2000,
    easing = (t: number) => t,
    delay = 0,
    formatter = (value: number) => Math.round(value).toLocaleString()
  } = options;
  
  const [count, setCount] = useState(0);
  
  // Linear easing
  const linearEasing = (t: number) => t;
  
  // Ease out cubic easing
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  
  // Create animation
  const animate = useCallback(() => {
    const start = 0;
    const startTime = performance.now();
    const easingFn = easing || easeOutCubic;
    
    const updateCount = (currentTime: number) => {
      let elapsedTime = currentTime - startTime;
      
      // Handle delay
      if (elapsedTime < delay) {
        requestAnimationFrame(updateCount);
        return;
      }
      
      elapsedTime -= delay;
      
      if (elapsedTime < duration) {
        const progress = easingFn(elapsedTime / duration);
        const nextCount = start + progress * (endValue - start);
        setCount(nextCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [endValue, duration, easing, delay]);
  
  // Start animation when visible
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
