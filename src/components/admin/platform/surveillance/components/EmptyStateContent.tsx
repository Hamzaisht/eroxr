
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";

interface EmptyStateContentProps {
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const EmptyStateContent = ({ isLoading, error, onRefresh }: EmptyStateContentProps) => {
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p className="mb-2">{error}</p>
        <Button size="sm" onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return <LoadingState message="Loading sessions..." />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
      <Eye className="h-12 w-12 text-muted-foreground/30" />
      <p className="text-muted-foreground">No sessions found</p>
      <Button size="sm" onClick={onRefresh} variant="outline">
        <RefreshCw className="h-4 w-4 mr-1" />
        Refresh
      </Button>
    </div>
  );
};
