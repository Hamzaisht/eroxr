
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  username?: string;
  onDismiss: () => void;
}

export const WelcomeBanner = ({ username, onDismiss }: WelcomeBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white"
        >
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <div>
                <h2 className="text-lg font-bold">
                  Welcome{username ? ` back, ${username}!` : '!'}
                </h2>
                <p className="text-sm text-white/90">
                  Share your moments, connect with others, and explore amazing content
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-700" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
