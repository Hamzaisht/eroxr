import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { MessageCircle, Plus, Search, ArrowUp, X } from "lucide-react";

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const shouldShow = window.scrollY > 500;
    if (showScrollTop !== shouldShow) {
      setShowScrollTop(shouldShow);
    }
  }, [showScrollTop]);

  // Use throttled scroll listener
  useEffect(() => {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actions = [
    {
      icon: Plus,
      label: "Become Creator",
      onClick: () => console.log("Become Creator"),
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: Search,
      label: "Browse Creators", 
      onClick: () => console.log("Browse Creators"),
      color: "bg-accent hover:bg-accent/90",
    },
    {
      icon: MessageCircle,
      label: "Live Support",
      onClick: () => console.log("Live Support"),
      color: "bg-secondary hover:bg-secondary/90",
    },
  ];

  return (
    <>
      {/* Main Floating Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Action Items */}
          <AnimatePresence>
            {isExpanded && (
              <div className="absolute bottom-16 right-0 space-y-3">
                {actions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    onClick={action.onClick}
                    className={`${action.color} text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center group relative transition-all duration-200`}
                  >
                    <action.icon className="w-5 h-5" />
                    
                    {/* Tooltip */}
                    <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-background/95 backdrop-blur-sm text-foreground px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-primary/20">
                      {action.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Main Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
            >
              {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 w-12 h-12 bg-background/80 backdrop-blur-sm border border-primary/30 hover:border-primary/50 text-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};