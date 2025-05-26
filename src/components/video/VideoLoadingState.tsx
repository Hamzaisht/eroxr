
interface VideoLoadingStateProps {
  isStalled?: boolean;
  isTimedOut?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ isStalled, isTimedOut, onRetry }: VideoLoadingStateProps) => {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
      {isTimedOut ? (
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to load</div>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-luxury-primary hover:text-luxury-primary/80"
            >
              Retry
            </button>
          )}
        </div>
      ) : isStalled ? (
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-luxury-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-luxury-neutral">Loading (stalled)...</div>
        </div>
      ) : (
        <div className="animate-spin h-8 w-8 border-2 border-luxury-primary border-t-transparent rounded-full"></div>
      )}
    </div>
  );
};
