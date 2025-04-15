
import { Loader2, RefreshCw } from 'lucide-react';

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ isStalled = false, onRetry }: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
      {isStalled ? (
        <>
          <p className="text-white/80 mb-2">Buffering video...</p>
          <Loader2 className="h-8 w-8 text-white/80 animate-spin" />
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-3 py-1 mt-3 bg-luxury-primary/50 hover:bg-luxury-primary/80 text-white rounded-md text-sm"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </button>
          )}
        </>
      ) : (
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      )}
    </div>
  );
};
