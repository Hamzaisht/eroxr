
import { Loader2 } from "lucide-react";

export const StoryLoadingState = () => {
  return (
    <div className="w-full h-32 flex items-center justify-center bg-luxury-dark/40 backdrop-blur-md rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        <p className="text-sm text-luxury-neutral">Loading stories...</p>
      </div>
    </div>
  );
};
