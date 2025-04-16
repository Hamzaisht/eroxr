
import { Loader2, AlertTriangle } from "lucide-react";

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ isStalled, onRetry }: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex flex-col items-center justify-center p-4 text-white">
        {isStalled ? (
          <>
            <AlertTriangle className="h-8 w-8 mb-2 text-yellow-400 animate-pulse" />
            <p className="text-center text-sm mb-2">Video playback stalled</p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm"
              >
                Retry
              </button>
            )}
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm">Loading video...</p>
          </>
        )}
      </div>
    </div>
  );
};
