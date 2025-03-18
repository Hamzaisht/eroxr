
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VideoErrorStateProps {
  onRetry?: () => void;
  errorDetails?: string;
}

export const VideoErrorState = ({ onRetry, errorDetails }: VideoErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4 z-10"
    >
      <div className="flex flex-col items-center space-y-4 text-center max-w-xs">
        <div className="bg-red-500/10 p-3 rounded-full">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-white">Video Failed to Load</h3>
        
        {errorDetails && (
          <p className="text-sm text-white/70">
            {errorDetails}
          </p>
        )}
        
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="mt-2 bg-white/10 hover:bg-white/20 border-white/20"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  );
};
