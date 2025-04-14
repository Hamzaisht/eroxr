
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useContextualMediaUpload } from '@/hooks/useContextualMediaUpload';
import { ImageIcon, VideoIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface MediaUploaderProps {
  context: 'post' | 'story' | 'message' | 'short' | 'avatar';
  onComplete: (url: string) => void;
  acceptedTypes?: string;
  className?: string;
  buttonText?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  context,
  onComplete,
  acceptedTypes = 'image/*,video/*',
  className = '',
  buttonText = 'Upload Media'
}) => {
  const { uploadFile, isUploading, progress, error } = useContextualMediaUpload(context);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const result = await uploadFile(selectedFile);
    if (result.success && result.url) {
      onComplete(result.url);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <ImageIcon className="w-6 h-6" />;
    
    if (selectedFile.type.startsWith('video/')) {
      return <VideoIcon className="w-6 h-6" />;
    }
    
    return <ImageIcon className="w-6 h-6" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="media-upload"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('media-upload')?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {getFileIcon()}
          <span className="ml-2">Select File</span>
        </Button>
      </div>
      
      {selectedFile && (
        <div className="p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFileIcon()}
              <div className="text-sm truncate max-w-[200px]">
                {selectedFile.name}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      )}
      
      {selectedFile && !isUploading && (
        <Button onClick={handleUpload} className="w-full">
          {buttonText}
        </Button>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading... {Math.round(progress)}%</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {!error && progress === 100 && !isUploading && (
        <div className="p-3 bg-green-500/10 text-green-500 rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Upload complete!</span>
        </div>
      )}
    </div>
  );
};
