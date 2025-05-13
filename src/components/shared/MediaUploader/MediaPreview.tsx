
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FileInfo } from './types';

interface MediaPreviewProps {
  file: File | null;
  previewUrl: string | null;
  previewError: string | null; 
  previewLoading: boolean;
  selectedFileInfo: FileInfo | null;
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
  if (!file || !selectedFileInfo) return null;
  
  const isImage = selectedFileInfo.type.startsWith('image/');
  const isVideo = selectedFileInfo.type.startsWith('video/');
  
  const sizeInMB = (selectedFileInfo.size / (1024 * 1024)).toFixed(2);
  
  return (
    <div className="relative border rounded-md p-2 bg-muted/20">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClear}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium">{selectedFileInfo.name} ({sizeInMB} MB)</div>
        
        {/* Preview area */}
        <div className="relative rounded-md overflow-hidden bg-black/10 flex items-center justify-center min-h-[200px]">
          {previewLoading ? (
            <div className="flex items-center justify-center h-full w-full min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin opacity-70" />
            </div>
          ) : previewError ? (
            <div className="text-destructive text-sm p-2">
              {previewError}
            </div>
          ) : isImage && previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-[300px] object-contain"
            />
          ) : isVideo && previewUrl ? (
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-[300px] object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full min-h-[200px]">
              <p className="text-sm opacity-70">No preview available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
