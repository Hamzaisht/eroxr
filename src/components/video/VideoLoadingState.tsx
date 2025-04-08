
import { Loader2, AlertCircle } from "lucide-react";

interface VideoLoadingStateProps {
  isStalled?: boolean;
}

export const VideoLoadingState = ({ isStalled }: VideoLoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      {isStalled ? (
        <>
          <AlertCircle className="h-6 w-6 text-yellow-500 mb-2" />
          <span className="text-xs text-luxury-neutral/80">Video is taking longer than usual...</span>
        </>
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      )}
    </div>
  );
};
