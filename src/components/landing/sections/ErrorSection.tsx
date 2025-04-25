
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorSectionProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorSection = ({
  title = "Failed to load content",
  description = "We're having trouble loading this section. Please try again later.",
  onRetry
}: ErrorSectionProps) => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-red-500/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="mx-auto flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorSection;
