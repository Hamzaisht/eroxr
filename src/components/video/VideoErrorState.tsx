import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoErrorStateProps {
  onRetry?: () => void;
}

export const VideoErrorState = ({ onRetry }: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm z-10">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-sm text-red-500 mb-4">Failed to load video</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRetry}
          className="bg-white/10 hover:bg-white/20"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};