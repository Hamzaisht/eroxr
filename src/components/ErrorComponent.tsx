
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          variant="outline"
          size="sm"
          className="text-xs border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-white"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
