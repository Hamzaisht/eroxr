
import { useState, useRef } from 'react';
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
   * Content type category ('story', 'post', etc)
   */
  context?: UploadOptions['contentCategory'];
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allowedTypes = (() => {
    if (mediaTypes === 'image') return SUPPORTED_IMAGE_TYPES;
    if (mediaTypes === 'video') return SUPPORTED_VIDEO_TYPES;
    return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  })();
  
  const uploadOptions = {
    contentCategory: context,
    maxSizeInMB,
    allowedTypes,
    autoResetOnCompletion: true,
    resetDelay: 3000
  };
  
  const { 
    uploadMedia, 
    uploadState: { isUploading, progress, error, success },
    validateFile 
  } = useMediaUpload(uploadOptions);
  
  const { 
    previewUrl, 
    isLoading: previewLoading, 
    error: previewError,
    clearPreview
  } = useFilePreview(selectedFile);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      if (onError) onError(validation.message || "Invalid file");
      return;
    }
    
    setSelectedFile(file);
    
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
    const result = await uploadMedia(file);
    
    if (result.success && result.url) {
      if (onComplete) onComplete(result.url);
    } else {
      if (onError) onError(result.error || "Upload failed");
    }
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    clearPreview();
    
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
            />
          ) : isVideoFile(selectedFile) ? (
            <video 
              src={previewUrl} 
              className="w-full h-auto max-h-64"
              controls
            />
          ) : (
            <div className="flex items-center justify-center h-32 bg-muted">
              <p className="text-sm text-muted-foreground">
                {selectedFile.name}
              </p>
            </div>
          )}
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
