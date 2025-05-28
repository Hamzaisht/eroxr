
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Image, Video, Mic, Upload } from 'lucide-react';

interface FileListProps {
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
}

export const FileList = ({
  selectedFiles,
  isUploading,
  uploadProgress,
  uploadSuccess,
  onRemoveFile,
  onUpload
}: FileListProps) => {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-4 h-4" />;
    return <Upload className="w-4 h-4" />;
  };

  if (selectedFiles.length === 0) return null;

  return (
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
            onClick={() => onRemoveFile(index)}
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
      
      {!isUploading && !uploadSuccess && selectedFiles.length > 0 && (
        <Button 
          type="button"
          onClick={onUpload}
          className="w-full"
          size="sm"
        >
          Upload {selectedFiles.length} file(s)
        </Button>
      )}
    </div>
  );
};
