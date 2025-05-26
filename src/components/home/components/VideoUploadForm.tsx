
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video } from 'lucide-react';
import { AccessLevelSelector } from '@/components/upload/AccessLevelSelector';
import { MediaAccessLevel } from '@/utils/media/types';
import { useVideoUpload } from '@/components/upload/hooks/useVideoUpload';
import { useDropzone } from 'react-dropzone';

interface VideoUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const VideoUploadForm = ({ onSuccess, onCancel }: VideoUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState(MediaAccessLevel.PUBLIC);
  const [ppvAmount, setPpvAmount] = useState(0);

  const { uploadVideo, isUploading, progress, error } = useVideoUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setSelectedFile(acceptedFiles[0]);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title.trim()) return;

    const result = await uploadVideo(
      selectedFile,
      title,
      description,
      accessLevel,
      accessLevel === MediaAccessLevel.PPV ? ppvAmount : undefined
    );

    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold">Upload Short Video</h2>

        {!selectedFile ? (
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive ? 'border-luxury-primary bg-luxury-primary/5' : 'border-luxury-neutral/20 hover:border-luxury-primary/40'
            }`}
          >
            <input {...getInputProps()} />
            <Video className="mx-auto h-12 w-12 text-luxury-neutral/60 mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop your video here...' : 'Select a video to upload'}
            </p>
            <p className="text-sm text-luxury-neutral/60">
              Drag and drop or click to browse • MP4, MOV, WebM
            </p>
          </div>
        ) : (
          <div className="bg-luxury-neutral/5 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-luxury-primary" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-luxury-neutral/60">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                Change
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-luxury-neutral mb-2 block">
            Title *
          </label>
          <Input
            placeholder="Give your video a catchy title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-luxury-neutral mb-2 block">
            Description
          </label>
          <Textarea
            placeholder="Describe your video (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <AccessLevelSelector
          value={accessLevel}
          onChange={setAccessLevel}
          showPPV={true}
        />

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

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-luxury-neutral/60 text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedFile || !title.trim() || isUploading}
            className="flex-1"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
