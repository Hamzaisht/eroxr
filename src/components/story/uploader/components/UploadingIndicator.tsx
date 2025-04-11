
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadingIndicatorProps {
  progress: number;
}

export const UploadingIndicator = ({ progress }: UploadingIndicatorProps) => {
  const displayProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
      <Loader2 className="h-4 w-4 text-luxury-primary animate-spin" />
      <Progress 
        value={displayProgress} 
        className="h-1 w-full bg-luxury-neutral/10" 
      />
      <span className="text-xs text-luxury-primary/80">
        {Math.round(displayProgress)}%
      </span>
    </div>
  );
};
