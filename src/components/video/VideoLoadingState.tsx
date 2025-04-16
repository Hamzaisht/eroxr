
import { Loader2, AlertTriangle } from "lucide-react";

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ 
  isStalled = false,
  onRetry
}: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
      {isStalled ? (
        <>
          <AlertTriangle className="h-10 w-10 text-amber-400 mb-3" />
          <p className="mb-4">Buffering video...</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
            >
              Reload Video
            </button>
          )}
        </>
      ) : (
        <Loader2 className="h-10 w-10 animate-spin" />
      )}
    </div>
  );
};
