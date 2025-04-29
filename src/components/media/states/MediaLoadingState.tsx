
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaLoadingStateProps {
  message?: string;
  className?: string;
  showSpinner?: boolean;
  spinnerSize?: number;
}

export const MediaLoadingState = ({ 
  message = "Loading media...",
  className = "",
  showSpinner = true,
  spinnerSize = 8
}: MediaLoadingStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center bg-luxury-darker/80 rounded-md p-1",
        className
      )}
    >
      {showSpinner && (
        <Loader2 
          className={cn(
            "animate-spin text-luxury-primary mb-2",
            `h-${spinnerSize} w-${spinnerSize}`
          )} 
        />
      )}
      
      {message && (
        <p className="text-sm text-luxury-neutral/80 text-center">{message}</p>
      )}
    </motion.div>
  );
};
