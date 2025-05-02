
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
}

export const MediaErrorState = ({
  className,
  message = "Failed to load media",
  onRetry,
  accessibleUrl,
  retryCount = 0,
  maxRetries = 2
}: MediaErrorStateProps) => {
  const canRetry = onRetry && (maxRetries === 0 || retryCount < maxRetries);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full w-full bg-black/10 rounded p-4 text-center",
      className
    )}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-muted-foreground mb-2">{message}</p>
      
      <div className="flex gap-2 mt-2">
        {canRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
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
            className="text-xs"
            onClick={() => window.open(accessibleUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open in new tab
          </Button>
        )}
      </div>
    </div>
  );
};
