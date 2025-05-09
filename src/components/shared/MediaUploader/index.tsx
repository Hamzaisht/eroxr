import React, { useState, useRef, useCallback } from 'react';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useFilePreview } from '@/hooks/useFilePreview';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';
import { MediaUploaderProps } from './types';
import { getAllowedTypes, validateFile } from './utils';
import { FileUploadButton } from './FileUploadButton';
import { MediaPreview } from './MediaPreview';
import { DebugInfo } from './DebugInfo';
import { UploadProgress } from './UploadProgress';
import { UploadOptions } from '@/utils/media/types';

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onComplete,
  onError,
  context = 'generic',
  maxSizeInMB = 100,
  mediaTypes = 'both',
  buttonText = 'Upload Media',
  buttonVariant = 'default',
  className = '',
  showPreview = true,
  autoUpload = true,
  onFileCapture
}) => {
  // CRITICAL: Use useRef instead of useState for file storage to prevent data corruption
  const fileRef = useRef<File | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Keep selectedFileInfo state only for triggering UI updates, not for storing the actual file
  const [selectedFileInfo, setSelectedFileInfo] = useState<{name: string, type: string, size: number} | null>(null);
  
  const allowedTypes = getAllowedTypes(mediaTypes);
  
  const uploadOptions: UploadOptions = {
    contentCategory: context,
    maxSizeInMB,
    allowedTypes,
    autoResetOnCompletion: true,
    resetDelay: 3000,
    onProgress: (progress: number) => {}
  };
  
  const { 
    uploadMedia, 
    uploadState: { isUploading, progress, error, isComplete },
    validateFile: validateMediaFile 
  } = useMediaUpload(uploadOptions);
  
  const { 
    previewUrl, 
    isLoading: previewLoading, 
    error: filePreviewError,
    clearPreview,
    createPreview
  } = useFilePreview();
  
  // Capture errors from preview for debugging
  React.useEffect(() => {
    if (filePreviewError) {
      console.error("File preview error:", filePreviewError);
      setPreviewError(filePreviewError);
    } else {
      setPreviewError(null);
    }
  }, [filePreviewError]);
  
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    // CRITICAL: Get file directly from input event
    const file = e.target.files?.[0];
    if (!file) return;
    
    // CRITICAL: Run comprehensive file diagnostic
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      if (onError) onError(fileValidation.error || "Invalid file");
      return;
    }
    
    // Validate using the media upload hook
    const validation = validateMediaFile(file);
    if (!validation.valid) { 
      console.error("File validation failed:", validation.error);
      if (onError) onError(validation.error || "Invalid file");
      return;
    }
    
    // CRITICAL: Store file in useRef instead of useState to prevent data corruption
    fileRef.current = file;
    
    // Store only metadata in state for UI updates
    setSelectedFileInfo({
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Pass the raw File reference to parent if onFileCapture is provided
    if (onFileCapture) {
      onFileCapture(file);
    }
    
    console.log("Creating preview for file:", file.name);
    createPreview(file);
    
    if (autoUpload) {
      handleUpload(file);
    }
  }, [validateMediaFile, onError, onFileCapture, createPreview, autoUpload]);
  
  const handleUploadClick = useCallback(() => {
    if (fileRef.current) {
      handleUpload(fileRef.current);
    }
  }, []);
  
  const handleUpload = useCallback(async (file: File) => {
    // CRITICAL: Run comprehensive file diagnostic again right before upload
    runFileDiagnostic(file);
    
    // CRITICAL: Strict file validation again right before upload
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      if (onError) onError(fileValidation.error || "Invalid file");
      return;
    }
    
    const result = await uploadMedia(file, uploadOptions);
    
    if (result.success && result.url) {
      if (onComplete) onComplete(result.url);
    } else {
      if (onError) onError(result.error || "Upload failed");
    }
  }, [uploadMedia, uploadOptions, onComplete, onError]);
  
  const handleClear = useCallback(() => {
    fileRef.current = null;
    setSelectedFileInfo(null);
    clearPreview();
    setPreviewError(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearPreview]);
  
  // Helper function to determine if we have a selected file
  const hasSelectedFile = fileRef.current !== null && selectedFileInfo !== null;
  
  return (
    <div className={`relative space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        id="media-upload"
        type="file"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      {showPreview && hasSelectedFile && (
        <MediaPreview
          file={fileRef.current}
          previewUrl={previewUrl}
          previewError={previewError}
          previewLoading={previewLoading}
          selectedFileInfo={selectedFileInfo}
          onClear={handleClear}
          isUploading={isUploading}
        />
      )}
      
      <DebugInfo
        selectedFileInfo={selectedFileInfo}
        previewUrl={previewUrl}
        previewLoading={previewLoading}
        previewError={previewError}
        hasSelectedFile={hasSelectedFile}
      />
      
      {!hasSelectedFile ? (
        <FileUploadButton
          buttonText={buttonText}
          buttonVariant={buttonVariant}
          isUploading={isUploading}
          mediaTypes={mediaTypes}
          maxSizeInMB={maxSizeInMB}
          onClick={() => fileInputRef.current?.click()}
        />
      ) : !autoUpload && !isUploading ? (
        <Button
          variant="default"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {selectedFileInfo?.name}
        </Button>
      ) : null}
      
      <UploadProgress
        isUploading={isUploading}
        progress={progress}
        error={error}
      />
    </div>
  );
};

export * from './types';
export default MediaUploader;
