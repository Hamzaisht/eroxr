
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaErrorStateProps {
  onRetry?: () => void;
  accessibleUrl?: string | null;
  retryCount?: number;
  message?: string;
  hideDebugInfo?: boolean;
}

export const MediaErrorState = ({ 
  onRetry, 
  accessibleUrl,
  retryCount = 0,
  message = "Media could not be loaded",
  hideDebugInfo = true
}: MediaErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-darker/80 z-10 p-4">
      <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
      <div className="text-center mb-4">
        <p className="text-white/90 font-medium mb-1">{message}</p>
        <p className="text-white/60 text-sm">
          {retryCount > 0 ? `Failed after ${retryCount} attempts` : "Loading failed"}
        </p>
      </div>
      
      {onRetry && (
        <Button 
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2 bg-luxury-primary/20 hover:bg-luxury-primary/40 border-luxury-primary/40"
        >
          <RefreshCw className="h-3 w-3" />
          Try Again
        </Button>
      )}
      
      {!hideDebugInfo && accessibleUrl && (
        <div className="mt-4 px-3 py-2 bg-black/40 rounded text-xs text-white/50 max-w-full overflow-hidden text-ellipsis">
          <code className="break-all">{accessibleUrl.substring(0, 50)}...</code>
        </div>
      )}
    </div>
  );
};
