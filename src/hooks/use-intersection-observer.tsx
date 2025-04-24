
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  skip?: boolean;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
  skip = false,
}: UseIntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (skip) return;
    
    const node = ref.current;
    if (!node || (triggerOnce && hasTriggeredRef.current)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const newIsIntersecting = entry.isIntersecting;
        
        if (triggerOnce && newIsIntersecting) {
          hasTriggeredRef.current = true;
        }
        
        setIsIntersecting(newIsIntersecting);
        
        if (newIsIntersecting && triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { 
        root, 
        rootMargin, 
        threshold 
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, skip]);

  return [ref, isIntersecting];
}
