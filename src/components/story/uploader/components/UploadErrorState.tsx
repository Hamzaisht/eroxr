
import { AlertCircle } from "lucide-react";

export const UploadErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <span className="text-xs text-red-400 mt-1 text-center px-2">
        Upload failed
      </span>
      <span className="text-[10px] text-red-400/80 mt-1 text-center">
        Tap to try again
      </span>
    </div>
  );
};
