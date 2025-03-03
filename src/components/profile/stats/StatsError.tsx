
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface StatsErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const StatsError = ({ 
  message = "Failed to load profile stats. Please refresh or try again later.",
  onRetry 
}: StatsErrorProps) => {
  return (
    <div className="flex justify-center w-full py-6 px-4">
      <Alert variant="destructive" className="max-w-md bg-luxury-darker border-red-500/20">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {message}
            </AlertDescription>
          </div>
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="self-end mt-2"
            >
              <RefreshCcw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};
