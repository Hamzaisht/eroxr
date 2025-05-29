
import { Label } from "@/components/ui/label";
import { MediaUploadSection } from "@/components/post/MediaUploadSection";
import { AlertCircle, CheckCircle } from "lucide-react";

type MediaAccessLevel = 'private' | 'public' | 'subscribers_only';

interface MediaUploadDisplayProps {
  selectedFiles: FileList | null;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadInProgress: boolean;
  uploadedAssetIds: string[];
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart: () => void;
}

export const MediaUploadDisplay = ({
  selectedFiles,
  uploadError,
  uploadSuccess,
  uploadInProgress,
  uploadedAssetIds,
  onUploadComplete,
  onUploadStart
}: MediaUploadDisplayProps) => {
  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>Media Upload</Label>
      
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {uploadSuccess && !uploadInProgress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">
            ✓ {uploadedAssetIds.length} media file(s) uploaded successfully
          </p>
        </div>
      )}

      {uploadInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">📤 Uploading media files...</p>
        </div>
      )}

      <MediaUploadSection
        onUploadComplete={onUploadComplete}
        onUploadStart={onUploadStart}
        defaultAccessLevel={'public' as MediaAccessLevel}
      />
    </div>
  );
};
