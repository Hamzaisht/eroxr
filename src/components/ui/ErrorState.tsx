
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title, description, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md text-center p-6">
      <div className="bg-red-500/20 p-4 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
      <p className="text-white/70 mb-6">{description}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
