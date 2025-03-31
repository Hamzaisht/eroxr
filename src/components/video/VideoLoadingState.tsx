import { Loader2 } from "lucide-react";

export const VideoLoadingState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/50 backdrop-blur-sm z-10">
      <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
    </div>
  );
};