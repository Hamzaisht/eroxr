
import { Loader2 } from "lucide-react";

interface UploadingIndicatorProps {
  progress: number;
}

export const UploadingIndicator = ({ progress }: UploadingIndicatorProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-luxury-primary/80 animate-spin" />
      <span className="text-xs text-white/60 mt-2">
        {progress > 0 ? `${progress}%` : "Uploading..."}
      </span>
      <div className="w-16 h-1 bg-luxury-dark/40 rounded-full mt-1 overflow-hidden">
        <div 
          className="h-full bg-luxury-primary/70 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
