
import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { isVideoFile, isImageFile } from '@/utils/upload/validators';
import { createFilePreview, revokeFilePreview, formatFileSize } from '@/utils/upload/fileUtils';
import { UploadOptions } from '@/utils/media/types';
import { useFilePreview } from '@/hooks/useFilePreview';

export interface MultiFileUploaderProps {
  /**
   * Function called when all uploads complete
   */
  onUploadsComplete?: (urls: string[]) => void;
  
  /**
   * Function called on each successful upload
   */
  onFileUploaded?: (url: string, index: number) => void;
  
  /**
   * Function called when upload fails
   */
  onUploadError?: (error: string) => void;
  
  /**
   * Content type category
   */
  contentCategory?: UploadOptions['contentCategory'];
  
  /**
   * Maximum files to upload
   */
  maxFiles?: number;
  
  /**
   * Maximum file size in MB
   */
  maxSizeInMB?: number;
  
  /**
   * Allow only specific media types
   */
  mediaTypes?: 'image' | 'video' | 'both';
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Whether to auto-upload files on selection
   */
  autoUpload?: boolean;
}

export const MultiFileUploader = ({
  onUploadsComplete,
  onFileUploaded,
  onUploadError,
  contentCategory = 'generic',
  maxFiles = 10,
  maxSizeInMB = 100,
  mediaTypes = 'both',
  className = '',
  autoUpload = true
}: MultiFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allowedTypes = (() => {
    if (mediaTypes === 'image') return 'image/*';
    if (mediaTypes === 'video') return 'video/*';
    return 'image/*,video/*';
  })();
  
  const uploadOptions = {
    contentCategory,
    maxSizeInMB,
    autoResetOnCompletion: true
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
  } = useFilePreview();
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    const newFileErrors: Record<string, string> = {};
    const newPreviews: Record<string, string> = {};
    
    if (selectedFiles.length + files.length > maxFiles) {
      onUploadError?.(`You can upload a maximum of ${maxFiles} files`);
      return;
    }
    
    Array.from(files).forEach(file => {
      const fileId = `${file.name}-${Date.now()}`;
      
      const validation = validateFile(file);
      if (!validation.valid) {
        newFileErrors[fileId] = validation.message || "Invalid file";
        return;
      }
      
      newFiles.push(file);
      
      try {
        const previewUrl = createFilePreview(file);
        newPreviews[fileId] = previewUrl;
      } catch (error) {
        console.error('Failed to create preview:', error);
      }
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    setFileErrors(prev => ({ ...prev, ...newFileErrors }));
    setPreviews(prev => ({ ...prev, ...newPreviews }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (autoUpload && newFiles.length > 0) {
      handleUploadAll(newFiles);
    }
  };
  
  const handleUploadFile = async (file: File, index: number) => {
    const result = await uploadMedia(file);
    
    if (result.success && result.url) {
      setUploadedUrls(prev => [...prev, result.url!]);
      if (onFileUploaded) onFileUploaded(result.url, index);
    } else if (onUploadError) {
      onUploadError(result.error || "Upload failed");
    }
    
    return result;
  };
  
  const handleUploadAll = async (filesToUpload = selectedFiles) => {
    const urls: string[] = [];
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const result = await handleUploadFile(filesToUpload[i], i);
      if (result.success && result.url) {
        urls.push(result.url);
      }
    }
    
    if (urls.length > 0 && onUploadsComplete) {
      onUploadsComplete(urls);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (!fileToRemove) return;
    
    const fileId = `${fileToRemove.name}-${Date.now()}`;
    if (previews[fileId]) {
      revokeFilePreview(previews[fileId]);
      
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fileId];
        return newPreviews;
      });
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleClearAll = () => {
    Object.values(previews).forEach(url => {
      revokeFilePreview(url);
    });
    
    setSelectedFiles([]);
    setFileErrors({});
    setPreviews({});
    setUploadedUrls([]);
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={allowedTypes}
        onChange={handleFileSelect}
        multiple
        disabled={isUploading || selectedFiles.length >= maxFiles}
      />
      
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || selectedFiles.length >= maxFiles}
        className="w-full h-16"
      >
        <div className="flex flex-col items-center">
          <Upload className="h-5 w-5 mb-1" />
          <span>Select Files</span>
          <span className="text-xs text-muted-foreground mt-1">
            {selectedFiles.length} of {maxFiles} files selected
          </span>
        </div>
      </Button>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Selected Files</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isUploading}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          </div>
          
          {selectedFiles.map((file, index) => {
            const fileId = `${file.name}-${Date.now()}`;
            const preview = Object.values(previews)[index];
            
            return (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-2 border rounded-md bg-background"
              >
                <div className="h-12 w-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {preview && isImageFile(file) ? (
                    <img 
                      src={preview} 
                      alt={file.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : preview && isVideoFile(file) ? (
                    <video 
                      src={preview}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                      {isImageFile(file) ? (
                        <Plus className="h-5 w-5 text-primary/40" />
                      ) : (
                        <Upload className="h-5 w-5 text-primary/40" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      
      {!autoUpload && selectedFiles.length > 0 && (
        <Button
          variant="default"
          onClick={() => handleUploadAll()}
          disabled={isUploading || selectedFiles.length === 0}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
        </Button>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Uploading {uploadedUrls.length + 1}/{selectedFiles.length}...
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

export default MultiFileUploader;
