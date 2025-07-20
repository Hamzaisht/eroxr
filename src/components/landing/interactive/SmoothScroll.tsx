import { useEffect } from "react";

export const SmoothScroll = () => {
  useEffect(() => {
    let isScrolling = false;

    const smoothScrollTo = (targetY: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 800;
      let start: number;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startY + distance * easeOut);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          isScrolling = false;
        }
      };

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(step);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      
      const sections = document.querySelectorAll('section, .section');
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      let targetSection: Element | null = null;

      if (e.deltaY > 0) {
        // Scrolling down
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top > 10) {
            targetSection = section;
            break;
          }
        }
      } else {
        // Scrolling up
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const rect = section.getBoundingClientRect();
          if (rect.top < -10) {
            targetSection = section;
            break;
          }
        }
      }

      if (targetSection) {
        const rect = targetSection.getBoundingClientRect();
        const targetY = currentScrollY + rect.top;
        smoothScrollTo(targetY);
      }
    };

    // Only enable smooth scrolling on desktop
    if (window.innerWidth > 768) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return null;
};