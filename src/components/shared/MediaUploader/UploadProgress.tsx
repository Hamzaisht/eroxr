
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";

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
  if (!isUploading && !error) return null;
  
  return (
    <div className="space-y-2">
      {isUploading && (
        <>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              <span>Uploading...</span>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </>
      )}
      
      {error && (
        <div className="bg-destructive/10 p-2 rounded text-sm text-destructive flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
