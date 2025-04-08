
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  isComplete: boolean;
  isError: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const UploadProgress = ({
  isUploading,
  progress,
  isComplete,
  isError,
  errorMessage,
  onRetry
}: UploadProgressProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (isComplete) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Show success for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isComplete]);
  
  if (!isUploading && !isComplete && !isError) return null;
  
  return (
    <AnimatePresence mode="wait">
      {isUploading && (
        <motion.div 
          key="uploading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2 w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-luxury-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </div>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-luxury-primary to-luxury-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
      
      {isError && (
        <motion.div 
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-500/10 text-red-500 p-3 rounded-md flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm overflow-hidden text-ellipsis">{errorMessage || "Upload failed"}</span>
          </div>
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry}
              className="bg-transparent border-red-500/50 hover:bg-red-500/20"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </motion.div>
      )}
      
      {showSuccess && (
        <motion.div 
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="bg-green-500/10 text-green-500 p-3 rounded-md flex items-center"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Upload successful!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
