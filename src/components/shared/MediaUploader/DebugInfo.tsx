
import React from 'react';
import { FileInfo } from './types';

interface DebugInfoProps {
  selectedFileInfo: FileInfo | null;
  previewUrl: string | null;
  previewLoading: boolean;
  previewError: string | null;
  hasSelectedFile: boolean;
}

// Only shows in development mode, helpful for debugging
export const DebugInfo: React.FC<DebugInfoProps> = ({
  selectedFileInfo,
  previewUrl,
  previewLoading,
  previewError,
  hasSelectedFile,
}) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="text-xs border border-dashed border-gray-300 p-2 mb-2 rounded bg-muted/20">
      <div className="font-bold">Debug Info:</div>
      <div>hasSelectedFile: {String(hasSelectedFile)}</div>
      <div>previewLoading: {String(previewLoading)}</div>
      <div>previewError: {previewError || 'none'}</div>
      <div>previewUrl: {previewUrl ? 'exists' : 'none'}</div>
      {selectedFileInfo && (
        <div>
          <div>File: {selectedFileInfo.name}</div>
          <div>Type: {selectedFileInfo.type}</div>
          <div>Size: {(selectedFileInfo.size / 1024 / 1024).toFixed(2)} MB</div>
        </div>
      )}
    </div>
  );
};
