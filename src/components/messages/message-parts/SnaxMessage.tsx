import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Timer, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SnaxMessageProps {
  message: any;
  isOwn: boolean;
  onView?: () => void;
}

export const SnaxMessage = ({ message, isOwn, onView }: SnaxMessageProps) => {
  const [isViewed, setIsViewed] = useState(!!message.viewed_at);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (message.expires_at) {
      const expiresAt = new Date(message.expires_at).getTime();
      const now = Date.now();
      
      if (now >= expiresAt) {
        setIsExpired(true);
        return;
      }

      const interval = setInterval(() => {
        const remaining = Math.max(0, expiresAt - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          setIsExpired(true);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [message.expires_at]);

  const handleView = () => {
    if (!isViewed && !isExpired && onView) {
      setIsViewed(true);
      onView();
    }
  };

  // After viewing, show temporary content then disappear
  if (isViewed && !isOwn) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 3, delay: 2 }}
        className={cn(
          "flex",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        <div className="max-w-xs p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/80">
            <EyeOff className="h-4 w-4" />
            <span className="text-sm">Snax viewed and disappeared</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // If expired and not viewed
  if (isExpired && !isViewed) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.6 }}
        className={cn(
          "flex",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        <div className="max-w-xs p-3 rounded-2xl bg-gray-800/50 border border-gray-600/50">
          <div className="flex items-center gap-2 text-gray-400">
            <Timer className="h-4 w-4" />
            <span className="text-sm">Snax expired</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // If already viewed by owner (show as sent)
  if (isViewed && isOwn) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.7 }}
        className="flex justify-end"
      >
        <div className="max-w-xs p-3 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/40">
          <div className="flex items-center gap-2 text-white/80">
            <Eye className="h-4 w-4" />
            <span className="text-sm">Snax viewed</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Viewable Snax (not yet viewed by recipient)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={cn(
        "flex",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <motion.button
        onClick={handleView}
        disabled={isOwn}
        className={cn(
          "group relative max-w-xs p-4 rounded-2xl transition-all duration-300",
          "bg-gradient-to-br from-purple-600/20 to-pink-600/20",
          "border-2 border-gradient-to-r from-purple-500 to-pink-500",
          "hover:from-purple-600/30 hover:to-pink-600/30",
          "hover:scale-105 active:scale-95",
          !isOwn && "cursor-pointer",
          isOwn && "cursor-default opacity-80"
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))',
          borderImage: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153)) 1'
        }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-lg animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center gap-2 text-white">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
            <span className="font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Snax
            </span>
          </div>
          
          {!isOwn && (
            <p className="text-sm text-white/80 text-center">
              Tap to view • Disappears after viewing
            </p>
          )}
          
          {isOwn && (
            <p className="text-sm text-white/60 text-center">
              Waiting to be viewed
            </p>
          )}
          
          {timeLeft !== null && timeLeft > 0 && (
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Timer className="h-3 w-3" />
              <span>Expires in {timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Sparkle effects */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1 -right-1"
        >
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute -bottom-1 -left-1"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-70" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};