import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageCircle, Plus, Search, ArrowUp, Sparkles } from "lucide-react";

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                    transition={{ delay: index * 0.1 }}
                    onClick={action.onClick}
                    className={`${action.color} text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center group relative transition-all duration-300`}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-6 h-6" />
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
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 w-12 h-12 bg-background/80 backdrop-blur-sm border border-primary/30 hover:border-primary/50 text-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Creator Application Quick Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-24 w-80 bg-background/95 backdrop-blur-xl border border-primary/30 rounded-xl p-6 shadow-2xl z-40"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quick Creator Application</h3>
                <p className="text-xs text-muted-foreground">Join in under 60 seconds</p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your creator name"
                className="w-full bg-muted/50 border border-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-muted/50 border border-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
              <select className="w-full bg-muted/50 border border-primary/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/40 transition-colors">
                <option>Content type</option>
                <option>Photography</option>
                <option>Videos</option>
                <option>Live Streaming</option>
                <option>Art & Creative</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Apply Now
              </motion.button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-3">
              No upfront costs • Start earning immediately
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};