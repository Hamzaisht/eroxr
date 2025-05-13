
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  isUploading
}) => {
  if (!isUploading) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span>Uploading...</span>
        </div>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
};
