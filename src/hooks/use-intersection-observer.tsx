
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const newIsIntersecting = entry.isIntersecting;
        setIsIntersecting(newIsIntersecting);
        
        if (newIsIntersecting && triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      { root, rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting];
}
