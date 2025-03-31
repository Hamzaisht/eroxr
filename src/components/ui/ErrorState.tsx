
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-md"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-luxury-neutral mb-6">{description}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-luxury-primary hover:bg-luxury-primary/80"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
