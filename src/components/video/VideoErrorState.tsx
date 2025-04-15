
import { AlertCircle, RefreshCw } from 'lucide-react';

interface VideoErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-white mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-luxury-primary hover:bg-luxury-primary/80 text-white rounded-md"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
};
