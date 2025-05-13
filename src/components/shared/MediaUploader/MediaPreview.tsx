
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "./utils";
import { MediaPreviewProps } from "./types";
import { isImageFile, isVideoFile } from "@/utils/upload/validators";

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  previewUrl,
  previewError,
  previewLoading,
  selectedFileInfo,
  onClear,
  isUploading
}) => {
  if (!file || !selectedFileInfo) return null;
  
  return (
    <div className="relative border rounded-md p-4">
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-6 w-6"
          onClick={onClear}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 space-y-4">
        {previewLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : previewError ? (
          <div className="p-2 bg-destructive/10 text-destructive rounded text-sm">
            {previewError}
          </div>
        ) : previewUrl && isImageFile(file) ? (
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 rounded-md object-contain"
            />
          </div>
        ) : previewUrl && isVideoFile(file) ? (
          <div className="flex justify-center">
            <video
              src={previewUrl}
              controls
              className="max-h-40 rounded-md"
            />
          </div>
        ) : (
          <div className="p-4 bg-muted rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">No preview available</span>
          </div>
        )}
        
        <div className="text-sm">
          <p className="font-medium truncate">{selectedFileInfo.name}</p>
          <p className="text-muted-foreground">
            {selectedFileInfo.type} • {formatFileSize(selectedFileInfo.size)}
          </p>
        </div>
      </div>
    </div>
  );
};
