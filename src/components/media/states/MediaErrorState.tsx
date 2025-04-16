
import { AlertCircle, RefreshCw } from 'lucide-react';

interface MediaErrorStateProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
  accessibleUrl?: string | null;
  retryCount?: number;
}

export const MediaErrorState = ({ 
  message = "Failed to load media",
  className = "",
  onRetry,
  accessibleUrl,
  retryCount = 0
}: MediaErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-luxury-darker/80 h-full w-full rounded p-4 ${className}`}>
      <AlertCircle className="h-8 w-8 text-luxury-neutral/70 mb-2" />
      <p className="text-sm text-luxury-neutral/90 text-center mb-2">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-md bg-luxury-darker hover:bg-luxury-dark text-luxury-neutral text-sm"
        >
          <RefreshCw size={14} className="mr-1" />
          Try Again
        </button>
      )}
      
      {process.env.NODE_ENV === 'development' && accessibleUrl && (
        <div className="mt-4 text-xs text-luxury-neutral/50 max-w-full break-all">
          <p>URL: {accessibleUrl}</p>
          <p>Retries: {retryCount}</p>
        </div>
      )}
    </div>
  );
};
