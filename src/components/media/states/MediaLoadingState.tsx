
import { Loader2 } from "lucide-react";

export const MediaLoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/50 z-10">
      <Loader2 className="h-8 w-8 text-luxury-primary animate-spin" />
    </div>
  );
};
