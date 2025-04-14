
import { Loader2 } from "lucide-react";

export const MediaLoading = () => {
  return (
    <div className="flex items-center justify-center bg-black/60 p-4">
      <Loader2 className="h-6 w-6 animate-spin text-white/80" />
    </div>
  );
};
