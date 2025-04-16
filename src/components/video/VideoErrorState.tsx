
import { AlertCircle, RefreshCw } from "lucide-react";

interface VideoErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
      <div className="flex flex-col items-center justify-center p-6 text-white max-w-xs mx-auto">
        <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
        <p className="text-center mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 rounded-md"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
