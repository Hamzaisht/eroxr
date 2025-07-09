
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-2xl mx-auto">
        {/* Cyberpunk Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Create Epic Content
          </h1>
          <p className="text-muted-foreground">Upload your video and join the digital revolution</p>
        </div>

        <Card className="border-primary/20 bg-black/50 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!selectedFile ? (
                <div 
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                    isDragActive 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="relative z-10">
                    <div className="mx-auto h-20 w-20 mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      <div className="relative bg-black/80 rounded-full p-4 border border-primary/30">
                        <Video className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {isDragActive ? 'Drop it like it\'s hot! 🔥' : 'Upload Your Masterpiece'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your video or click to browse
                    </p>
                    <p className="text-sm text-primary/80 font-medium">
                      Supports MP4, MOV, WebM • Max 100MB
                    </p>
                  </div>
                  
                  {/* Cyberpunk Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur-lg opacity-50"></div>
                      <div className="relative bg-black/80 rounded-lg p-3 border border-primary/30">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                      <p className="text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • Ready to upload
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
                    <span className="text-primary">✨</span>
                    Title *
                  </label>
                  <Input
                    placeholder="Give your video an epic title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-black/50 border-primary/20 text-white placeholder-muted-foreground focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
                    <span className="text-blue-400">📝</span>
                    Description
                  </label>
                  <Textarea
                    placeholder="Tell the world what makes this video amazing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-black/50 border-primary/20 text-white placeholder-muted-foreground focus:border-primary resize-none"
                  />
                </div>
              </div>

        <AccessLevelSelector
          value={accessLevel}
          onChange={setAccessLevel}
          showPPV={true}
        />

              {accessLevel === MediaAccessLevel.PPV && (
                <div>
                  <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
                    <span className="text-yellow-400">💰</span>
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="Set your price..."
                    value={ppvAmount}
                    onChange={(e) => setPpvAmount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="bg-black/50 border-primary/20 text-white placeholder-muted-foreground focus:border-primary"
                  />
                </div>
              )}

              {isUploading && (
                <div className="space-y-4">
                  <div className="relative">
                    <Progress value={progress} className="w-full h-3 bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-full blur-sm"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white mb-1">
                      Uploading your masterpiece... {progress}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ⚡ Getting ready to blow minds
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isUploading}
                  className="flex-1 border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedFile || !title.trim() || isUploading}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-400 text-black font-bold hover:from-primary/90 hover:to-blue-400/90 disabled:from-muted-foreground disabled:to-muted-foreground"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Launch Video 🚀
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Cyberpunk Border Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500" />
          </div>
        </Card>
      </div>
    </div>
  );
};
