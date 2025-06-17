
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown } from "lucide-react";
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
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-900 via-blue-900 to-amber-600 p-6 text-white border border-amber-500/20"
        >
          {/* Greek-inspired background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm0 0l-15 15v-30l15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Greek laurel crown icon */}
              <div className="relative">
                <Crown className="w-8 h-8 text-amber-300" />
                <div className="absolute inset-0 bg-amber-300/20 rounded-full animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
                  Welcome to Olympus{username ? `, ${username}!` : ', Divine Creator!'}
                </h2>
                <p className="text-sm text-blue-100">
                  Ascend to greatness, share your divine visions, and connect with fellow creators of legend
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 border border-amber-400/30 hover:border-amber-400/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Animated Greek column elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left column */}
            <div className="absolute -left-8 top-0 w-4 h-full bg-gradient-to-b from-amber-400/20 to-transparent opacity-30" 
                 style={{
                   background: 'repeating-linear-gradient(0deg, rgba(251, 191, 36, 0.1) 0px, rgba(251, 191, 36, 0.2) 4px, transparent 4px, transparent 8px)'
                 }} 
            />
            
            {/* Right column */}
            <div className="absolute -right-8 top-0 w-4 h-full bg-gradient-to-b from-amber-400/20 to-transparent opacity-30"
                 style={{
                   background: 'repeating-linear-gradient(0deg, rgba(251, 191, 36, 0.1) 0px, rgba(251, 191, 36, 0.2) 4px, transparent 4px, transparent 8px)'
                 }}
            />
            
            {/* Floating golden particles */}
            <div className="absolute top-4 right-16 w-2 h-2 bg-amber-300 rounded-full animate-pulse opacity-60" />
            <div className="absolute bottom-6 left-20 w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-500 opacity-40" />
            <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse delay-1000 opacity-50" />
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
