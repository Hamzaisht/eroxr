
import React from 'react';
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isImageFile, isVideoFile } from '@/utils/upload/validators';

interface MediaPreviewProps {
  file: File | null;
  previewUrl: string | null;
  previewError: string | null;
  previewLoading: boolean;
  selectedFileInfo: { name: string; type: string; size: number } | null;
  onClear: () => void;
  isUploading: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  previewUrl,
  previewError,
  previewLoading,
  selectedFileInfo,
  onClear,
  isUploading
}) => {
  if (previewLoading) {
    return (
      <div className="relative border rounded-md overflow-hidden bg-black/5 h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="relative border rounded-md overflow-hidden bg-black/5">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full"
        onClick={onClear}
        disabled={isUploading}
      >
        <X size={16} />
      </Button>
      
      {file && isImageFile(file) ? (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-auto max-h-64 object-contain"
          onLoad={() => console.log("Preview image loaded successfully")}
          onError={(e) => {
            console.error("Error loading preview image:", e);
          }}
        />
      ) : file && isVideoFile(file) ? (
        <video 
          src={previewUrl} 
          className="w-full h-auto max-h-64"
          controls
          onLoadedData={() => console.log("Preview video loaded successfully")}
          onError={(e) => {
            console.error("Error loading preview video:", e);
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-32 bg-muted">
          <p className="text-sm text-muted-foreground">
            {selectedFileInfo?.name}
          </p>
        </div>
      )}
      
      {previewError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm text-center">{previewError}</p>
        </div>
      )}
    </div>
  );
};
