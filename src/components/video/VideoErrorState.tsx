
import { AlertCircle, RefreshCw } from "lucide-react";

interface VideoErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const VideoErrorState = ({ 
  message = "Failed to load video", 
  onRetry 
}: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
      <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
      <p className="text-white/90 mb-4">{message}</p>
      
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
  );
};
