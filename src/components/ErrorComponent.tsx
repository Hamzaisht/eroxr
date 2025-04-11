
import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export const ErrorComponent = ({ message, className = "", onRetry }: ErrorComponentProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-black/40 rounded-md ${className}`}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-center text-red-100 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs px-3 py-1 bg-red-500/30 hover:bg-red-500/50 text-white rounded"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
