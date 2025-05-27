
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Video, Mic, Upload, X } from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaAccessLevel } from '@/utils/media/types';
import { Progress } from '@/components/ui/progress';

interface MediaUploadSectionProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  defaultAccessLevel?: MediaAccessLevel;
}

export const MediaUploadSection = ({
  onUploadComplete,
  defaultAccessLevel = MediaAccessLevel.PUBLIC
}: MediaUploadSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia, uploadState } = useMediaUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        setUploadProgress(((index + 1) / selectedFiles.length) * 100);
        
        return uploadMedia(file, {
          contentCategory: 'post',
          accessLevel: defaultAccessLevel,
          metadata: { usage: 'post' }
        });
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r.success);
      
      if (successfulUploads.length > 0) {
        const urls = successfulUploads.map(r => r.url!);
        const assetIds = successfulUploads.map(r => r.assetId!);
        onUploadComplete(urls, assetIds);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-4 h-4" />;
    return <Upload className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add More Media
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files ({selectedFiles.length})</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-luxury-neutral/5 rounded">
              <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-luxury-neutral/60">
                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {(isUploading || uploadProgress > 0) && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-luxury-neutral/60 text-center">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          <Button 
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
            size="sm"
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        </div>
      )}
    </div>
  );
};
