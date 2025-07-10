import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = "Loading analytics data...", className = "" }: LoadingOverlayProps) {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}