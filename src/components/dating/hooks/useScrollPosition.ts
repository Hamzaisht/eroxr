
import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll helper
  const restoreScroll = (savedPosition: number) => {
    const timer = setTimeout(() => {
      window.scrollTo(0, savedPosition);
    }, 100);
    return () => clearTimeout(timer);
  };

  return {
    scrollPosition,
    restoreScroll
  };
}
