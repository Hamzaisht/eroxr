
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Upload, X, Image, Video, FileText } from 'lucide-react';
import { useUniversalUpload } from '@/hooks/useUniversalUpload';
import { AccessLevelSelector } from './AccessLevelSelector';
import { MediaAccessLevel, MediaType } from '@/utils/media/types';
import { useDropzone } from 'react-dropzone';

interface UniversalUploaderProps {
  onUploadComplete?: (urls: string[], assetIds: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  defaultAccessLevel?: MediaAccessLevel;
  showAccessSelector?: boolean;
  showPPV?: boolean;
  category?: string;
  className?: string;
}

export const UniversalUploader = ({
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*'],
  defaultAccessLevel = MediaAccessLevel.PUBLIC,
  showAccessSelector = true,
  showPPV = true,
  category = 'general',
  className = ""
}: UniversalUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [accessLevel, setAccessLevel] = useState(defaultAccessLevel);
  const [ppvAmount, setPpvAmount] = useState<number>(0);
  const [altText, setAltText] = useState('');

  const { upload, uploadMultiple, isUploading, progress, error, urls, assetIds, reset } = useUniversalUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - selectedFiles.length,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const uploadOptions = {
      accessLevel,
      category,
      altText: altText || undefined,
      metadata: {
        ppvAmount: accessLevel === MediaAccessLevel.PPV ? ppvAmount : undefined,
        category
      }
    };

    let results;
    if (selectedFiles.length === 1) {
      results = [await upload(selectedFiles[0], uploadOptions)];
    } else {
      results = await uploadMultiple(selectedFiles, uploadOptions);
    }

    const successfulUploads = results.filter(r => r.success);
    if (successfulUploads.length > 0) {
      onUploadComplete?.(urls, assetIds);
      setSelectedFiles([]);
      setAltText('');
      setPpvAmount(0);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragActive ? 'border-luxury-primary bg-luxury-primary/5' : 'border-luxury-neutral/20 hover:border-luxury-primary/40'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-luxury-neutral/60 mb-2" />
        <p className="text-sm text-luxury-neutral mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag and drop files here or click to browse'}
        </p>
        <p className="text-xs text-luxury-neutral/60">
          Supported: {acceptedTypes.join(', ')} • Max {maxFiles} files
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
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
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {showAccessSelector && (
            <AccessLevelSelector
              value={accessLevel}
              onChange={setAccessLevel}
              showPPV={showPPV}
            />
          )}

          {accessLevel === MediaAccessLevel.PPV && (
            <div>
              <label className="text-sm font-medium text-luxury-neutral mb-2 block">
                Price (USD)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={ppvAmount}
                onChange={(e) => setPpvAmount(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-luxury-neutral mb-2 block">
              Alt Text (Optional)
            </label>
            <Input
              placeholder="Describe this content for accessibility"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-luxury-neutral/60 text-center">Uploading... {progress}%</p>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
          >
            {isUploading ? `Uploading... ${progress}%` : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        </div>
      )}
    </Card>
  );
};
