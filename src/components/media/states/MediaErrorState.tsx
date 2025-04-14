
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";

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
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDebug = async () => {
    if (!accessibleUrl) return;
    
    setIsLoading(true);
    try {
      // Run debug utilities on the URL
      await debugMediaUrl(accessibleUrl);
      
      // Get info about the URL for display
      const urlInfo = new URL(accessibleUrl);
      setDebugInfo({
        protocol: urlInfo.protocol,
        hostname: urlInfo.hostname,
        pathname: urlInfo.pathname,
        search: urlInfo.search,
        hash: urlInfo.hash,
        origin: urlInfo.origin,
      });
      
      setIsDebugVisible(true);
      
      toast({
        title: "Debug info available",
        description: "Check the console for detailed debugging information",
      });
    } catch (err) {
      console.error("Error during debugging:", err);
      toast({
        title: "Debug failed",
        description: "Could not analyze the media URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (accessibleUrl) {
      window.open(accessibleUrl, '_blank');
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-darker/80 z-10 p-4">
      <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
      <div className="text-center mb-4">
        <p className="text-white/90 font-medium mb-1">{message}</p>
        <p className="text-white/60 text-sm">
          {retryCount > 0 ? `Failed after ${retryCount} attempts` : "Loading failed"}
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
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
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDebug}
              disabled={isLoading}
              className="flex items-center gap-2 bg-black/30 hover:bg-black/50 border-gray-700/40"
            >
              {isLoading ? 'Analyzing...' : 'Debug URL'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 bg-black/30 hover:bg-black/50 border-gray-700/40"
            >
              <ExternalLink className="h-3 w-3" />
              Open URL
            </Button>
          </>
        )}
      </div>
      
      {isDebugVisible && debugInfo && !hideDebugInfo && (
        <div className="mt-4 px-3 py-2 bg-black/40 rounded text-xs text-white/70 max-w-full overflow-auto w-full max-h-[200px]">
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
      
      {!hideDebugInfo && accessibleUrl && (
        <div className="mt-4 px-3 py-2 bg-black/40 rounded text-xs text-white/50 max-w-full overflow-hidden text-ellipsis">
          <code className="break-all">{accessibleUrl.substring(0, 100)}{accessibleUrl.length > 100 ? '...' : ''}</code>
        </div>
      )}
    </div>
  );
};
