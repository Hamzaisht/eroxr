
import { AlertCircle, RefreshCw } from "lucide-react";

interface MediaErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const MediaError = ({
  message = "Failed to load media",
  onRetry
}: MediaErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black/80 p-4 rounded-lg">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-white/90 text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white/90 text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
