
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  progress,
  error
}) => {
  if (!isUploading && !error) {
    return null;
  }

  return (
    <>
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Uploading...
            </span>
            <span className="text-sm font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </>
  );
};
