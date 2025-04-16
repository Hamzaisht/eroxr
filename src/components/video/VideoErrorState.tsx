
import { AlertCircle, RefreshCw } from "lucide-react";

interface VideoErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
      <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
      <p className="text-center mb-4 max-w-xs">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-luxury-primary/80 hover:bg-luxury-primary text-white rounded-md"
        >
          <RefreshCw className="h-4 w-4" /> 
          Retry
        </button>
      )}
    </div>
  );
};
