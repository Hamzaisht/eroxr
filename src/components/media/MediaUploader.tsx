
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image, Video, FileText } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';

interface MediaUploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  accessLevel?: 'private' | 'public' | 'subscribers_only';
}

export const MediaUploader = ({
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  accessLevel = 'private'
}: MediaUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMultiple, isUploading, uploadProgress } = useMediaUpload();

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, maxFiles - selectedFiles.length);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const results = await uploadMultiple(selectedFiles, accessLevel);
    const successfulUploads = results.filter(r => r.success);
    
    if (successfulUploads.length > 0) {
      const urls = successfulUploads.map(r => r.url!);
      onUploadComplete?.(urls);
      setSelectedFiles([]);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <Card className="p-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-2">
          Drag and drop files here or click to browse
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={selectedFiles.length >= maxFiles}
        >
          Choose Files
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-2"
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        </div>
      )}
    </Card>
  );
};
