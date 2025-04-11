
import { Loader2 } from "lucide-react";

interface VideoLoadingIndicatorProps {
  isBuffering: boolean;
}

export const VideoLoadingIndicator = ({ isBuffering }: VideoLoadingIndicatorProps) => {
  if (!isBuffering) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
    </div>
  );
};
