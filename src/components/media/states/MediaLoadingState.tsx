
import { Loader2 } from "lucide-react";

interface MediaLoadingStateProps {
  className?: string;
}

export const MediaLoadingState = ({ className }: MediaLoadingStateProps) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 z-10 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-white/80" />
    </div>
  );
};
