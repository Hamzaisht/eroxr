
import { Loader2, RefreshCw } from "lucide-react";

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ isStalled, onRetry }: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
      {isStalled ? (
        <div className="flex flex-col items-center">
          <p className="text-white/80 text-sm mb-2">Video loading is taking longer than expected</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          )}
        </div>
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-white/80" />
      )}
    </div>
  );
};
