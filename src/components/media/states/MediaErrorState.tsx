
import { AlertCircle, ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaErrorStateProps {
  className?: string;
  message?: string;
  onRetry?: () => void;
  accessibleUrl?: string;
  retryCount?: number;
  maxRetries?: number;
  compact?: boolean;
}

export const MediaErrorState = ({
  className,
  message = "Media unavailable",
  onRetry,
  accessibleUrl,
  retryCount = 0,
  maxRetries = 2,
  compact = false
}: MediaErrorStateProps) => {
  const canRetry = onRetry && (maxRetries === 0 || retryCount < maxRetries);

  if (compact) {
    return (
      <div className={cn(
        "flex items-center justify-center h-32 w-full bg-luxury-darker/50 rounded-lg border border-luxury-neutral/10",
        className
      )}>
        <div className="text-center p-4">
          <AlertCircle className="h-6 w-6 text-luxury-neutral/50 mx-auto mb-2" />
          <p className="text-xs text-luxury-neutral/70">Media not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full w-full bg-luxury-darker/20 rounded-lg p-4 text-center border border-luxury-neutral/10",
      className
    )}>
      <AlertCircle className="h-8 w-8 text-luxury-neutral/50 mb-2" />
      <p className="text-sm text-luxury-neutral/70 mb-2">{message}</p>
      
      <div className="flex gap-2 mt-2">
        {canRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-luxury-darker border-luxury-neutral/20 hover:bg-luxury-neutral/10"
            onClick={onRetry}
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
        
        {accessibleUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-luxury-darker border-luxury-neutral/20 hover:bg-luxury-neutral/10"
            onClick={() => window.open(accessibleUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        )}
      </div>
    </div>
  );
};
