
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaErrorStateProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
  accessibleUrl?: string | null;
  retryCount?: number;
  showDebugInfo?: boolean;
}

export const MediaErrorState = ({ 
  message = "Failed to load media",
  className = "",
  onRetry,
  accessibleUrl,
  retryCount = 0,
  showDebugInfo = false
}: MediaErrorStateProps) => {
  // Generate a unique truncated version of the URL for display
  const displayUrl = accessibleUrl && accessibleUrl.length > 30
    ? accessibleUrl.substring(0, 15) + '...' + accessibleUrl.substring(accessibleUrl.length - 15)
    : accessibleUrl;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center bg-luxury-darker/80 h-full w-full rounded p-4",
        className
      )}
    >
      <AlertCircle className="h-8 w-8 text-luxury-neutral/70 mb-2" />
      <p className="text-sm text-luxury-neutral/90 text-center mb-2">{message}</p>
      
      {onRetry && (
        <motion.button 
          onClick={onRetry}
          className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-md bg-luxury-darker hover:bg-luxury-dark text-luxury-neutral text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={14} className="mr-1" />
          Try Again
        </motion.button>
      )}
      
      {(process.env.NODE_ENV === 'development' || showDebugInfo) && accessibleUrl && (
        <div className="mt-4 text-xs text-luxury-neutral/50 max-w-[200px] truncate break-all">
          <p title={accessibleUrl}>URL: {displayUrl}</p>
          <p>Retries: {retryCount}</p>
        </div>
      )}
    </motion.div>
  );
};
