
import { Loader2 } from 'lucide-react';

interface MediaLoadingStateProps {
  message?: string;
  className?: string;
}

export const MediaLoadingState = ({ 
  message = "Loading media...",
  className = ""
}: MediaLoadingStateProps) => {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-luxury-primary mb-2" />
      <p className="text-sm text-white/80">{message}</p>
    </div>
  );
};
