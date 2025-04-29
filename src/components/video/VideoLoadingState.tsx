
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface VideoLoadingStateProps {
  isStalled?: boolean;
  isTimedOut?: boolean;
  onRetry?: () => void;
  timeoutDuration?: number;
}

export const VideoLoadingState = ({ 
  isStalled = false,
  isTimedOut = false,
  onRetry,
  timeoutDuration = 15000
}: VideoLoadingStateProps) => {
  const [showRetryButton, setShowRetryButton] = useState(false);
  
  useEffect(() => {
    // Show retry button after a delay even if not explicitly stalled
    if (!isStalled && !isTimedOut) {
      const timer = setTimeout(() => {
        setShowRetryButton(true);
      }, timeoutDuration);
      
      return () => clearTimeout(timer);
    } else {
      setShowRetryButton(isStalled || isTimedOut);
    }
  }, [isStalled, isTimedOut, timeoutDuration]);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isTimedOut ? (
        <>
          <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
          <p className="mb-4">Video load timed out</p>
        </>
      ) : isStalled ? (
        <>
          <AlertTriangle className="h-10 w-10 text-amber-400 mb-3" />
          <p className="mb-4">Buffering video...</p>
        </>
      ) : (
        <Loader2 className="h-10 w-10 animate-spin mb-3" />
      )}
      
      {showRetryButton && onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md flex items-center gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="h-4 w-4" />
          Reload Video
        </motion.button>
      )}
    </motion.div>
  );
};
