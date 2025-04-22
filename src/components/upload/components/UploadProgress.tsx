
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const UploadProgress = ({ isUploading, progress, error }: UploadProgressProps) => {
  if (!isUploading) return null;

  return (
    <div className="mt-4">
      <Label>Upload Progress</Label>
      <Progress value={progress} />
      {error && (
        <Badge variant="destructive" className="mt-2">{error}</Badge>
      )}
    </div>
  );
};
