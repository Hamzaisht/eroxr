
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface VideoErrorStateProps {
  onRetry?: () => void;
  errorDetails?: string;
}

export const VideoErrorState = ({ onRetry, errorDetails }: VideoErrorStateProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm z-10 p-3 md:p-4"
    >
      <AlertCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-red-500 mb-2`} />
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-red-500 mb-1 md:mb-2 text-center font-medium`}>
        Error loading media
      </p>
      {errorDetails && (
        <p className="text-xs text-red-400/80 mb-3 md:mb-4 text-center max-w-xs">
          {errorDetails}
        </p>
      )}
      {onRetry && (
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onRetry}
          className="bg-white/10 hover:bg-white/20 flex items-center gap-1.5 transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="h-3 w-3" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
