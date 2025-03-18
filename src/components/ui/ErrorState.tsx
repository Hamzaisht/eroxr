
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ 
  title = "Something went wrong", 
  description = "There was an error loading the content. Please try again.",
  onRetry 
}: ErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-luxury-neutral mb-6 max-w-md">{description}</p>
      
      {onRetry && (
        <Button onClick={onRetry} className="bg-luxury-primary hover:bg-luxury-primary/80">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
