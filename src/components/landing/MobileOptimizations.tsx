import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Menu, X } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation = ({ isOpen, onToggle }: MobileNavigationProps) => {
  const menuItems = [
    { label: "Home", href: "#hero" },
    { label: "Creators", href: "#creators" },
    { label: "Pricing", href: "#pricing" },
    { label: "Live Feed", href: "#live-feed" },
    { label: "Trust & Security", href: "#trust" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Join Now", href: "#join" }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
        />
      )}

      {/* Menu */}
      <motion.div
        className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-white/10 z-50"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Menu</h3>
            <button
              onClick={onToggle}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <nav className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="block py-3 px-4 text-white hover:bg-white/10 rounded-lg transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={onToggle}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              Join as Fan
            </Button>
            <Button variant="outline" className="w-full border-white/20 text-white">
              Become Creator
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

interface StickyBottomBarProps {
  isVisible: boolean;
}

const StickyBottomBar = ({ isVisible }: StickyBottomBarProps) => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="bg-black/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex gap-3">
          <Button 
            size="lg" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
          >
            Join Now
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1 border-white/20 text-white"
          >
            Explore
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Free to join • Start earning immediately
        </p>
      </div>
    </motion.div>
  );
};

interface ScrollToTopProps {
  isVisible: boolean;
}

const ScrollToTop = ({ isVisible }: ScrollToTopProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className="fixed bottom-20 right-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg z-30 md:bottom-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </motion.button>
  );
};

interface SwipeIndicatorProps {
  direction: 'left' | 'right';
  isVisible: boolean;
}

const SwipeIndicator = ({ direction, isVisible }: SwipeIndicatorProps) => {
  return (
    <motion.div
      className={`fixed top-1/2 ${direction === 'left' ? 'left-4' : 'right-4'} z-30 md:hidden pointer-events-none`}
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      animate={{ 
        opacity: isVisible ? 0.6 : 0,
        x: isVisible ? 0 : (direction === 'left' ? -20 : 20)
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
        <motion.div
          animate={{ x: direction === 'left' ? [-5, 5, -5] : [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-xl"
        >
          {direction === 'left' ? '←' : '→'}
        </motion.div>
      </div>
    </motion.div>
  );
};

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const LazyImage = ({ src, alt, className = "", placeholder = "/api/placeholder/400/300" }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`lazy-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div id={`lazy-${src}`} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <motion.img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover filter blur-sm ${className}`}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      
      {/* Loading Spinner */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export const MobileOptimizations = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      // Show/hide bottom bar based on scroll direction
      setIsBottomBarVisible(latest < 100 || latest > scrollY.getPrevious());
      
      // Show scroll to top after scrolling down
      setIsScrollTopVisible(latest > 500);
    });

    // Hide swipe indicator after 5 seconds
    const timer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [scrollY]);

  // Touch/swipe handling for sections
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Horizontal swipe detection
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next section
          window.dispatchEvent(new CustomEvent('swipeLeft'));
        } else {
          // Swipe right - previous section
          window.dispatchEvent(new CustomEvent('swipeRight'));
        }
      }

      startX = 0;
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Navigation Menu */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />

      {/* Sticky Bottom Bar */}
      <StickyBottomBar isVisible={isBottomBarVisible} />

      {/* Scroll to Top Button */}
      <ScrollToTop isVisible={isScrollTopVisible} />

      {/* Swipe Indicators */}
      <SwipeIndicator direction="left" isVisible={showSwipeIndicator} />
      <SwipeIndicator direction="right" isVisible={showSwipeIndicator} />

      {/* Mobile CSS will be in index.css instead of styled-jsx */}
    </>
  );
};

// Export the LazyImage component for use in other components
export { LazyImage };