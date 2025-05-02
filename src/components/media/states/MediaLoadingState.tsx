
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaLoadingStateProps {
  className?: string;
  message?: string;
}

export const MediaLoadingState = ({ 
  className, 
  message = "Loading media..." 
}: MediaLoadingStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full w-full bg-black/10 rounded p-4",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
