
import React from 'react';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from "@/utils/upload/validators";
import { FileDropzone } from './components/FileDropzone';
import { UploadProgress } from './components/UploadProgress';
import { PreviewGrid } from './components/PreviewGrid';
import { useFileUploader } from './components/useFileUploader';
import { Accept } from 'react-dropzone';

interface MultiFileUploaderProps {
  onUploadComplete?: (files: File[]) => void;
  onUploadsComplete?: (urls: string[]) => void;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  contentCategory?: string;
  maxFiles?: number;
  autoUpload?: boolean;
}

export const MultiFileUploader = ({ 
  onUploadComplete,
  onUploadsComplete,
  maxSizeInMB = 50,
  allowedTypes = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES],
  contentCategory = 'generic',
  maxFiles = 10,
  autoUpload = false
}: MultiFileUploaderProps) => {
  const {
    uploadState,
    previews,
    handleDrop,
    handleRemove,
    handleManualUpload,
  } = useFileUploader({
    maxSizeInMB,
    allowedTypes,
    maxFiles,
    autoUpload,
    onUploadComplete,
    onUploadsComplete,
    contentCategory,
  });

  const acceptTypes: Accept = allowedTypes.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as Accept);

  return (
    <div className="w-full">
      <FileDropzone
        onDrop={handleDrop}
        acceptTypes={acceptTypes}
        maxSizeInBytes={maxSizeInMB * 1024 * 1024}
        maxFiles={maxFiles}
        maxSizeInMB={maxSizeInMB}
      />

      <UploadProgress
        isUploading={uploadState.isUploading}
        progress={uploadState.progress}
        error={uploadState.error}
      />

      <PreviewGrid
        previews={previews}
        onRemove={handleRemove}
        isUploading={uploadState.isUploading}
        onManualUpload={handleManualUpload}
        autoUpload={autoUpload}
      />
    </div>
  );
};
