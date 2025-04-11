
import { AlertCircle, RefreshCw } from "lucide-react";

interface MediaErrorStateProps {
  message?: string;
  onRetry: () => void;
  accessibleUrl: boolean;
  retryCount: number;
}

export const MediaErrorState = ({ 
  message = "Failed to load media", 
  onRetry, 
  accessibleUrl,
  retryCount
}: MediaErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-white/80 mb-3 text-center px-4">
        {!accessibleUrl 
          ? "Media access error" 
          : message}
      </p>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded"
      >
        <RefreshCw className="h-4 w-4" /> 
        Retry
      </button>
    </div>
  );
};
