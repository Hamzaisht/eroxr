
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaErrorStateProps {
  onRetry: () => void;
  accessibleUrl: string | null;
  retryCount: number;
}

export const MediaErrorState = ({
  onRetry,
  accessibleUrl,
  retryCount
}: MediaErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-white/80 text-sm mb-4">Media could not be loaded</p>
      
      <Button 
        variant="outline" 
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
        className="flex items-center gap-2"
        size="sm"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Try Again</span>
      </Button>
      
      {retryCount >= 2 && accessibleUrl && (
        <div className="mt-3 text-center">
          <a 
            href={accessibleUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Open directly
          </a>
        </div>
      )}
    </div>
  );
};
