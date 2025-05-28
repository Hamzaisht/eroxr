
import { AlertCircle, CheckCircle } from 'lucide-react';

interface UploadStatusProps {
  uploadError: string | null;
  uploadSuccess: boolean;
  isUploading: boolean;
}

export const UploadStatus = ({ uploadError, uploadSuccess, isUploading }: UploadStatusProps) => {
  if (uploadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-700">{uploadError}</p>
      </div>
    );
  }

  if (uploadSuccess && !isUploading) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
        <p className="text-sm text-green-700">All files uploaded successfully!</p>
      </div>
    );
  }

  return null;
};
