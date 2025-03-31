
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";

interface VideoErrorStateProps {
  onRetry?: () => void;
  errorDetails?: string;
}

export const VideoErrorState = ({ onRetry, errorDetails }: VideoErrorStateProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm z-10 p-3 md:p-4">
      <AlertCircle className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-red-500 mb-2`} />
      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 mb-1 md:mb-2 text-center`}>Failed to load video</p>
      {errorDetails && (
        <p className="text-xs text-red-400/80 mb-3 md:mb-4 text-center max-w-xs">
          {errorDetails}
        </p>
      )}
      {onRetry && (
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onRetry}
          className="bg-white/10 hover:bg-white/20"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
