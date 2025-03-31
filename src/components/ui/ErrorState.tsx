
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ 
  title = "Something went wrong", 
  description = "We couldn't load the content. Please try again.",
  onRetry
}: ErrorStateProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center p-4 md:p-8 max-w-full md:max-w-md"
    >
      <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-red-500/10 flex items-center justify-center mb-3 md:mb-4`}>
        <AlertCircle className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-red-500`} />
      </div>
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-white mb-1 md:mb-2`}>{title}</h2>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-luxury-neutral mb-4 md:mb-6`}>{description}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          size={isMobile ? "sm" : "default"}
          className="bg-luxury-primary hover:bg-luxury-primary/80"
        >
          <RefreshCw className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
