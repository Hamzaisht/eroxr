import React, { useState, useRef, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { FilePlus, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from "@/utils/upload/validators";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  files: File[];
  previews: string[];
}

interface FileValidationResult {
  isValid: boolean;
  message?: string;
}

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
  allowedTypes = [
    ...SUPPORTED_IMAGE_TYPES,
    ...SUPPORTED_VIDEO_TYPES
  ],
  contentCategory = 'generic',
  maxFiles = 10,
  autoUpload = false
}: MultiFileUploaderProps) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    files: [],
    previews: []
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
      files: files,
      previews: []
    });
    
    const interval = setInterval(() => {
      setUploadState(prevState => {
        const newProgress = Math.min(prevState.progress + Math.random() * 20, 99);
        return { ...prevState, progress: newProgress };
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadState(prevState => ({
        ...prevState,
        progress: 100,
        success: true,
        isUploading: false
      }));
      
      if (onUploadComplete) {
        onUploadComplete(files);
      }
      
      const mockUrls = files.map((_, i) => 
        `https://storage.example.com/${contentCategory}/${Date.now()}-${i}.file`
      );
      onUploadsComplete(mockUrls);
      
      toast({
        title: "Upload Complete",
        description: "All files have been successfully uploaded.",
      });
    }, 3000);
  }, [onUploadComplete, onUploadsComplete, toast, contentCategory]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const filesArray = Array.from(acceptedFiles);
    
    const validFiles = filesArray.filter(file => {
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File Too Large",
          description: `File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB.`,
          variant: "destructive",
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `File "${file.name}" has an unsupported file type.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    if (previews.length + validFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can only upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }
    
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    if (autoUpload && validFiles.length > 0) {
      handleUpload(validFiles);
    }
  }, [handleUpload, allowedTypes, maxSizeInBytes, maxSizeInMB, toast, previews, maxFiles, autoUpload]);

  const acceptTypes: Accept = allowedTypes.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as Accept);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: handleDrop,
    accept: acceptTypes,
    maxSize: maxSizeInBytes,
    multiple: true
  });

  const handleRemove = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleManualUpload = () => {
    if (previews.length > 0 && !uploadState.isUploading) {
      const dummyFiles = Array(previews.length).fill(null).map((_, i) => 
        new File([""], `file-${i}.jpg`, { type: "image/jpeg" })
      );
      handleUpload(dummyFiles);
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()}
        className="relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
      >
        <input {...getInputProps()} ref={inputRef} />
        <FilePlus className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          (Max {maxSizeInMB}MB per file, {maxFiles} files, {allowedTypes.map(type => type.split('/')[1]).join(', ')} allowed)
        </p>
      </div>

      {uploadState.isUploading && (
        <div className="mt-4">
          <Label>Upload Progress</Label>
          <Progress value={uploadState.progress} />
          {uploadState.error && (
            <Badge variant="destructive" className="mt-2">{uploadState.error}</Badge>
          )}
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="rounded-md aspect-square object-cover" 
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full shadow-md hover:bg-muted text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {!autoUpload && previews.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleManualUpload} 
                disabled={uploadState.isUploading || uploadState.success}
              >
                {uploadState.isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
