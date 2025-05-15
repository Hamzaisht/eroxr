
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@/utils/upload/validators';
import { useToast } from '@/hooks/use-toast';
import { UploadOptions } from '@/utils/media/types';

interface MediaUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  bucketName: string;
  folderPath?: string;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: 'images' | 'videos' | 'all';
  className?: string;
  buttonText?: string;
  showPreview?: boolean;
  options?: Omit<UploadOptions, 'bucket'>;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  bucketName,
  folderPath = '',
  maxFiles = 5,
  maxSizeInMB = 50,
  acceptedFileTypes = 'all',
  className = '',
  buttonText = 'Upload Media',
  showPreview = true,
  options = {}
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Determine accepted MIME types based on acceptedFileTypes
  const getAcceptedTypes = () => {
    switch (acceptedFileTypes) {
      case 'images':
        return SUPPORTED_IMAGE_TYPES;
      case 'videos':
        return SUPPORTED_VIDEO_TYPES;
      case 'all':
      default:
        return [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
    }
  };
  
  const acceptedTypes = getAcceptedTypes();

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check file count
    if (acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at a time.`);
      return;
    }

    // Check file size
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSizeInMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSizeInMB}MB.`);
      return;
    }

    // Check file type
    const invalidTypeFiles = acceptedFiles.filter(file => !acceptedTypes.includes(file.type));
    if (invalidTypeFiles.length > 0) {
      setError(`Some files have unsupported formats.`);
      return;
    }

    // Generate previews for accepted files
    const newPreviews: string[] = [];
    acceptedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
    });

    setFiles(acceptedFiles);
    setPreviews(newPreviews);
    setError(null);
  }, [maxFiles, maxSizeInMB, acceptedTypes]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((obj, type) => {
      obj[type] = [];
      return obj;
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize: maxSizeInMB * 1024 * 1024,
  });

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      let totalProgress = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Log file details for debugging
        console.log("🧬 FILE DEBUG", {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        // Generate path for storage
        const path = folderPath 
          ? `${folderPath}/${Date.now()}_${file.name}` 
          : `${Date.now()}_${file.name}`;

        // Upload file
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(path, file, { 
            upsert: true,
            ...options
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }

        // Update progress
        totalProgress = ((i + 1) / files.length) * 100;
        setProgress(totalProgress);
      }

      // Clean up previews
      previews.forEach(url => URL.revokeObjectURL(url));
      
      // Reset state
      setFiles([]);
      setPreviews([]);
      setProgress(0);

      // Notify completion
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${uploadedUrls.length} files.`,
      });
      
      onUploadComplete(uploadedUrls);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'An error occurred during upload.');
      
      if (onUploadError) {
        onUploadError(error.message || 'Upload failed');
      }
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || 'An error occurred during upload.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file removal from preview
  const handleRemoveFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    // Remove file and preview
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the files here'
              : `Drag & drop files here, or click to select files`}
          </p>
          <p className="text-xs text-gray-500">
            Max {maxFiles} files, up to {maxSizeInMB}MB each
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File previews */}
      {showPreview && previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                {files[index]?.type.startsWith('video/') ? (
                  <video
                    src={preview}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {isUploading && progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 text-right">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Upload button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          {isUploading ? 'Uploading...' : buttonText}
        </Button>
      </div>
    </div>
  );
};
