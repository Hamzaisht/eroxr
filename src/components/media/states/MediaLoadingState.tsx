
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaLoadingStateProps {
  className?: string;
  message?: string;
}

export const MediaLoadingState = ({ 
  className, 
  message = "Loading..." 
}: MediaLoadingStateProps) => {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center bg-luxury-darker/30 backdrop-blur-sm rounded",
      className
    )}>
      <Loader2 className="h-6 w-6 animate-spin text-luxury-primary mb-2" />
      <p className="text-xs text-luxury-neutral/70">{message}</p>
    </div>
  );
};
