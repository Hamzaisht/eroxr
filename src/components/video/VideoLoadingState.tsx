
import { Loader2 } from "lucide-react";

export const VideoLoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
    </div>
  );
};
