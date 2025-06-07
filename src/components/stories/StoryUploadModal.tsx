
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Camera, Image, Video, X, Sparkles, Zap, Star } from 'lucide-react';
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

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Files must be 100MB or less.',
        variant: 'destructive',
      });
      return;
    }

    // Validate video duration if it's a video
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
      handleClose();
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setUploadMode('select');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto border-none p-0 overflow-hidden">
        <motion.div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.95) 0%, rgba(23, 23, 23, 0.9) 50%, rgba(13, 13, 13, 0.95) 100%)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              className="absolute top-4 right-8 w-16 h-16 bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-8 left-6 w-12 h-12 bg-gradient-to-tr from-luxury-secondary/30 to-luxury-primary/30 rounded-full blur-lg"
              animate={{ 
                scale: [1.2, 0.8, 1.2],
                x: [0, 10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </div>

          <div className="relative p-8 z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                  Create Story
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Sparkles className="w-4 h-4 text-luxury-accent" />
                  <span className="text-sm text-luxury-neutral">Share your moment</span>
                </div>
              </motion.div>
              <motion.button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X className="w-5 h-5 text-luxury-neutral group-hover:text-white transition-colors" />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {uploadMode === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => setUploadMode('camera-photo')}
                      className="group relative h-24 rounded-2xl bg-gradient-to-br from-luxury-primary/10 to-luxury-primary/5 border border-luxury-primary/20 hover:border-luxury-primary/40 transition-all duration-500 overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex flex-col items-center justify-center h-full space-y-2">
                        <Camera className="w-6 h-6 text-luxury-primary group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-luxury-neutral font-medium">Take Photo</span>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => setUploadMode('camera-video')}
                      className="group relative h-24 rounded-2xl bg-gradient-to-br from-luxury-accent/10 to-luxury-accent/5 border border-luxury-accent/20 hover:border-luxury-accent/40 transition-all duration-500 overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex flex-col items-center justify-center h-full space-y-2">
                        <Video className="w-6 h-6 text-luxury-accent group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-luxury-neutral font-medium">Record Video</span>
                      </div>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-24 rounded-2xl bg-gradient-to-br from-luxury-secondary/10 to-luxury-secondary/5 border border-luxury-secondary/20 hover:border-luxury-secondary/40 transition-all duration-500 overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex flex-col items-center justify-center h-full space-y-2">
                        <Image className="w-6 h-6 text-luxury-secondary group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-luxury-neutral font-medium">Upload Photo</span>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-24 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex flex-col items-center justify-center h-full space-y-2">
                        <Upload className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-luxury-neutral font-medium">Upload Video</span>
                      </div>
                    </motion.button>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10">
                    {selectedFile?.type.startsWith('video/') ? (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Add a caption (optional)"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-luxury-neutral/60 rounded-xl py-3 px-4 focus:border-luxury-primary/50 transition-all duration-300"
                      maxLength={200}
                    />
                  </div>

                  {uploading && (
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm text-luxury-neutral text-center">
                        Uploading your story... {Math.round(uploadProgress)}%
                      </p>
                    </motion.div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setUploadMode('select')}
                      disabled={uploading}
                      className="flex-1 bg-white/5 border-white/10 text-luxury-neutral hover:bg-white/10 hover:text-white rounded-xl"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !user}
                      className="flex-1 bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/80 hover:to-luxury-accent/80 text-white rounded-xl border-none"
                    >
                      {uploading ? 'Uploading...' : 'Share Story'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
