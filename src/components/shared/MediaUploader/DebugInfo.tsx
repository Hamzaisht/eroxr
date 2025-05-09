
import React from 'react';

interface DebugInfoProps {
  selectedFileInfo: {name: string; type: string; size: number} | null;
  previewUrl: string | null;
  previewLoading: boolean;
  previewError: string | null;
  hasSelectedFile: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  selectedFileInfo,
  previewUrl,
  previewLoading,
  previewError,
  hasSelectedFile
}) => {
  if (process.env.NODE_ENV !== 'development' || !hasSelectedFile) {
    return null;
  }

  return (
    <div className="bg-muted/30 p-2 rounded text-xs font-mono overflow-auto max-h-40">
      <p>File: {selectedFileInfo?.name} ({Math.round((selectedFileInfo?.size || 0) / 1024)} KB)</p>
      <p>Type: {selectedFileInfo?.type}</p>
      <p>Preview URL: {previewUrl ? "Created" : "None"}</p>
      <p>Preview Loading: {previewLoading ? "Yes" : "No"}</p>
      <p>Preview Error: {previewError || "None"}</p>
    </div>
  );
};
