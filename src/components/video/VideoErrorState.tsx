
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface VideoErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-darker/80 backdrop-blur-sm z-10 p-4 text-center"
    >
      <AlertCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-red-500 mb-2`} />
      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-luxury-neutral/70 mb-2`}>
        {message || "Failed to load video"}
      </span>
      <span className="text-xs text-luxury-neutral/50 mb-4">
        The video may be unavailable or in an unsupported format
      </span>
      
      {onRetry && (
        <Button 
          size={isMobile ? "sm" : "default"}
          variant="outline" 
          onClick={onRetry}
          className="gap-2 bg-luxury-darker/50 border-luxury-neutral/20"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
