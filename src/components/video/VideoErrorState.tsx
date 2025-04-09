
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const VideoErrorState = ({ message, onRetry }: VideoErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
      <p className="text-white/80 mb-4">{message}</p>
      {onRetry && (
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="flex items-center gap-2"
          variant="default"
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
