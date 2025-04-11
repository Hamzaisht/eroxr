
import { AlertCircle } from "lucide-react";

export const UploadErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 p-2">
      <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
      <span className="text-xs text-red-500 text-center">
        Upload failed
      </span>
      <span className="text-[10px] text-red-500/70 text-center">
        Try again
      </span>
    </div>
  );
};
