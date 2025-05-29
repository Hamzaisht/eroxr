
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { FileList } from './MediaUploadSection/FileList';
import { UploadStatus } from './MediaUploadSection/UploadStatus';
import { useMediaUploadLogic } from './MediaUploadSection/hooks/useMediaUploadLogic';

type MediaAccessLevel = 'private' | 'public' | 'subscribers_only';

interface MediaUploadSectionProps {
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart?: () => void;
  defaultAccessLevel?: MediaAccessLevel;
}

export const MediaUploadSection = ({
  onUploadComplete,
  onUploadStart,
  defaultAccessLevel = 'public'
}: MediaUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedFiles,
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    handleFileSelect,
    removeFile,
    handleUpload
  } = useMediaUploadLogic({
    onUploadComplete,
    onUploadStart,
    defaultAccessLevel
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelect(files);
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
          Add Media Files
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      <UploadStatus 
        uploadError={uploadError}
        uploadSuccess={uploadSuccess}
        isUploading={isUploading}
      />

      <FileList
        selectedFiles={selectedFiles}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadSuccess={uploadSuccess}
        onRemoveFile={removeFile}
        onUpload={handleUpload}
      />
    </div>
  );
};
