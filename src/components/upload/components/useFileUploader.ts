
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseFileUploaderOptions {
  maxSizeInMB: number;
  allowedTypes: string[];
  maxFiles: number;
  autoUpload: boolean;
  onUploadComplete?: (files: File[]) => void;
  onUploadsComplete?: (urls: string[]) => void;
  contentCategory?: string;
}

export const useFileUploader = ({
  maxSizeInMB,
  allowedTypes,
  maxFiles,
  autoUpload,
  onUploadComplete,
  onUploadsComplete,
  contentCategory = 'generic'
}: UseFileUploaderOptions) => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null as string | null,
    success: false,
    files: [] as File[],
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
      files: files,
    }));
    
    const interval = setInterval(() => {
      setUploadState(prevState => ({
        ...prevState,
        progress: Math.min(prevState.progress + Math.random() * 20, 99)
      }));
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
      onUploadsComplete?.(mockUrls);
      
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
  }, [maxSizeInBytes, maxSizeInMB, allowedTypes, maxFiles, previews.length, toast, autoUpload, handleUpload]);

  const handleRemove = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleManualUpload = () => {
    if (previews.length > 0 && !uploadState.isUploading) {
      const dummyFiles = Array(previews.length).fill(null).map((_, i) => 
        new File([""], `file-${i}.jpg`, { type: "image/jpeg" })
      );
      handleUpload(dummyFiles);
    }
  };

  return {
    uploadState,
    previews,
    handleDrop,
    handleRemove,
    handleManualUpload,
  };
};
