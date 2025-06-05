
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Camera, Image, Video, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoryUpload } from '@/hooks/useStoryUpload';
import { useToast } from '@/hooks/use-toast';
import { CameraCapture } from './CameraCapture';

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryUploadModal = ({ open, onOpenChange }: StoryUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadMode, setUploadMode] = useState<'select' | 'camera-photo' | 'camera-video' | 'preview'>('select');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const { uploadStory, uploading, uploadProgress } = useStoryUpload();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image or video file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate video duration (max 60s)
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          toast({
            title: 'Video too long',
            description: 'Videos must be 60 seconds or less.',
            variant: 'destructive',
          });
          URL.revokeObjectURL(video.src);
          return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setUploadMode('preview');
      };
    } else {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadMode('preview');
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadMode('preview');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload stories',
        variant: 'destructive',
      });
      return;
    }

    const result = await uploadStory(selectedFile, caption);
    if (result.success) {
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      setUploadMode('select');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setUploadMode('select');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-luxury-darker border border-luxury-neutral/20 rounded-2xl overflow-hidden">
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Create Story</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-luxury-neutral hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {uploadMode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setUploadMode('camera-photo')}
                    className="h-20 border-luxury-neutral/20 hover:border-luxury-primary bg-luxury-darker/50 hover:bg-luxury-primary/10"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Camera className="w-6 h-6 text-luxury-primary" />
                      <span className="text-sm text-luxury-neutral">Take Photo</span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setUploadMode('camera-video')}
                    className="h-20 border-luxury-neutral/20 hover:border-luxury-accent bg-luxury-darker/50 hover:bg-luxury-accent/10"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Video className="w-6 h-6 text-luxury-accent" />
                      <span className="text-sm text-luxury-neutral">Record Video</span>
                    </div>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 border-luxury-neutral/20 hover:border-luxury-primary bg-luxury-darker/50 hover:bg-luxury-primary/10"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Image className="w-6 h-6 text-luxury-primary" />
                      <span className="text-sm text-luxury-neutral">Upload Photo</span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 border-luxury-neutral/20 hover:border-luxury-accent bg-luxury-darker/50 hover:bg-luxury-accent/10"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-6 h-6 text-luxury-accent" />
                      <span className="text-sm text-luxury-neutral">Upload Video</span>
                    </div>
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.div>
            )}

            {(uploadMode === 'camera-photo' || uploadMode === 'camera-video') && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <CameraCapture
                  mode={uploadMode === 'camera-photo' ? 'photo' : 'video'}
                  onCapture={handleCameraCapture}
                  onCancel={() => setUploadMode('select')}
                />
              </motion.div>
            )}

            {uploadMode === 'preview' && previewUrl && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
                  {selectedFile?.type.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <Input
                  placeholder="Add a caption (optional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-luxury-darker/50 border-luxury-neutral/20 text-white placeholder:text-luxury-neutral/60"
                  maxLength={200}
                />

                {uploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-luxury-neutral/20 rounded-full h-2">
                      <div
                        className="bg-luxury-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-luxury-neutral text-center">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setUploadMode('select')}
                    disabled={uploading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !user}
                    className="flex-1 bg-luxury-primary hover:bg-luxury-primary/80"
                  >
                    {uploading ? 'Uploading...' : 'Share Story'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
