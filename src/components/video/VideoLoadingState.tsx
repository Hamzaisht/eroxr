
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoLoadingStateProps {
  isStalled?: boolean;
  onRetry?: () => void;
}

export const VideoLoadingState = ({ isStalled, onRetry }: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
      {isStalled ? (
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <p className="text-sm text-white/80">Video is taking longer than usual...</p>
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="mt-2 px-3 py-1.5 bg-luxury-primary/80 hover:bg-luxury-primary rounded-md"
              variant="default"
              size="sm"
            >
              Retry
            </Button>
          )}
        </div>
      ) : (
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      )}
    </div>
  );
};
