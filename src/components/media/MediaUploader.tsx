
import { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useFilePreview } from '@/hooks/useFilePreview';
import { isVideoFile, isImageFile, SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';
import { UploadOptions } from '@/utils/media/types';

export interface MediaUploaderProps {
  /**
   * Function called when upload completes successfully
   */
  onComplete?: (url: string) => void;
  
  /**
   * Function called when upload fails
   */
  onError?: (error: string) => void;
  
  /**
   * Content type category
   */
  context?: string;
  
  /**
   * Maximum file size in MB
   */
  maxSizeInMB?: number;
  
  /**
   * Allow only specific media types
   */
  mediaTypes?: 'image' | 'video' | 'both';
  
  /**
   * Custom button text
   */
  buttonText?: string;
  
  /**
   * Button variant
   */
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  
  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * Whether to show media preview
   */
  showPreview?: boolean;

  /**
   * Whether to auto-upload on file selection
   */
  autoUpload?: boolean;
}

export const MediaUploader = ({
  onComplete,
  onError,
  context = 'generic',
  maxSizeInMB = 100,
  mediaTypes = 'both',
  buttonText = 'Upload Media',
  buttonVariant = 'default',
  className = '',
  showPreview = true,
  autoUpload = true
}: MediaUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allowedTypes = (() => {
    if (mediaTypes === 'image') return SUPPORTED_IMAGE_TYPES;
    if (mediaTypes === 'video') return SUPPORTED_VIDEO_TYPES;
    return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  })();
  
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
    validateFile 
  } = useMediaUpload(uploadOptions);
  
  const { 
    previewUrl, 
    isLoading: previewLoading, 
    error: filePreviewError,
    clearPreview,
    createPreview
  } = useFilePreview();
  
  // Capture errors from preview for debugging
  useEffect(() => {
    if (filePreviewError) {
      console.error("File preview error:", filePreviewError);
      setPreviewError(filePreviewError);
    } else {
      setPreviewError(null);
    }
  }, [filePreviewError]);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("File selected:", file.name, file.type, file.size);
    
    const validation = validateFile(file);
    if (!validation.valid) { 
      console.error("File validation failed:", validation.error);
      if (onError) onError(validation.error || "Invalid file");
      return;
    }
    
    setSelectedFile(file);
    
    console.log("Creating preview for file:", file.name);
    const preview = createPreview(file);
    console.log("Preview created:", preview ? "success" : "failed");
    
    if (autoUpload) {
      handleUpload(file);
    }
  };
  
  const handleUploadClick = async () => {
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };
  
  const handleUpload = async (file: File) => {
    const result = await uploadMedia(file, uploadOptions);
    
    if (result.success && result.url) {
      if (onComplete) onComplete(result.url);
    } else {
      if (onError) onError(result.error || "Upload failed");
    }
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    clearPreview();
    setPreviewError(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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
      
      {showPreview && selectedFile && previewUrl && (
        <div className="relative border rounded-md overflow-hidden bg-black/5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full"
            onClick={handleClear}
            disabled={isUploading}
          >
            <X size={16} />
          </Button>
          
          {isImageFile(selectedFile) ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-auto max-h-64 object-contain"
              onLoad={() => console.log("Preview image loaded successfully")}
              onError={(e) => {
                console.error("Error loading preview image:", e);
                setPreviewError("Failed to load image preview");
              }}
            />
          ) : isVideoFile(selectedFile) ? (
            <video 
              src={previewUrl} 
              className="w-full h-auto max-h-64"
              controls
              onLoadedData={() => console.log("Preview video loaded successfully")}
              onError={(e) => {
                console.error("Error loading preview video:", e);
                setPreviewError("Failed to load video preview");
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-32 bg-muted">
              <p className="text-sm text-muted-foreground">
                {selectedFile.name}
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
      )}
      
      {/* Preview loading state */}
      {showPreview && selectedFile && previewLoading && (
        <div className="relative border rounded-md overflow-hidden bg-black/5 h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}
      
      {/* Debug Info (in development mode) */}
      {process.env.NODE_ENV === 'development' && selectedFile && (
        <div className="bg-muted/30 p-2 rounded text-xs font-mono overflow-auto max-h-40">
          <p>File: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
          <p>Type: {selectedFile.type}</p>
          <p>Preview URL: {previewUrl ? "Created" : "None"}</p>
          <p>Preview Loading: {previewLoading ? "Yes" : "No"}</p>
          <p>Preview Error: {previewError || "None"}</p>
        </div>
      )}
      
      {!selectedFile ? (
        <Button
          variant={buttonVariant}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-16"
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-sm">{buttonText}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {mediaTypes === 'image' ? 'Images' : 
               mediaTypes === 'video' ? 'Videos' :
               'Images and videos'}
              {` (max ${maxSizeInMB}MB)`}
            </span>
          </div>
        </Button>
      ) : !autoUpload && !isUploading ? (
        <Button
          variant="default"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {selectedFile.name}
        </Button>
      ) : null}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Uploading...
            </span>
            <span className="text-sm font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
