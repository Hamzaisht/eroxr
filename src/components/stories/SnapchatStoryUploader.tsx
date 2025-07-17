import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Image, X, Send, Palette, Type, Smile, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface Filter {
  name: string;
  filter: string;
  intensity?: number;
}

const filters: Filter[] = [
  { name: 'Normal', filter: 'none' },
  { name: 'Vivid', filter: 'saturate(1.5) contrast(1.2)' },
  { name: 'Warm', filter: 'sepia(0.3) saturate(1.2)' },
  { name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.1)' },
  { name: 'Vintage', filter: 'sepia(0.8) contrast(1.1) brightness(0.9)' },
  { name: 'Drama', filter: 'contrast(1.5) brightness(0.8)' },
  { name: 'Neon', filter: 'saturate(2) hue-rotate(90deg) brightness(1.2)' },
  { name: 'Arctic', filter: 'brightness(1.1) saturate(0.8) hue-rotate(200deg)' }
];

const textColors = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
];

interface SnapchatStoryUploaderProps {
  open: boolean;
  onClose: () => void;
}

export const SnapchatStoryUploader = ({ open, onClose }: SnapchatStoryUploaderProps) => {
  const [mode, setMode] = useState<'select' | 'camera' | 'edit'>('select');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Text overlay states
  const [textOverlays, setTextOverlays] = useState<Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    size: number;
  }>>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (open && mode === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open, mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          setMediaFile(file);
          setMediaUrl(URL.createObjectURL(file));
          setMode('edit');
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaUrl(URL.createObjectURL(file));
      setMode('edit');
    }
  };

  const addTextOverlay = () => {
    if (currentText.trim()) {
      const newOverlay = {
        id: Date.now().toString(),
        text: currentText,
        x: 50,
        y: 50,
        color: currentTextColor,
        size: 24
      };
      setTextOverlays([...textOverlays, newOverlay]);
      setCurrentText('');
      setIsAddingText(false);
    }
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(overlay => overlay.id !== id));
  };

  const uploadStory = async () => {
    if (!mediaFile || !session?.user) return;

    setIsUploading(true);
    try {
      // Create a canvas with the edited image/video and overlays
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (mediaFile.type.startsWith('image/')) {
        const img = document.createElement('img') as HTMLImageElement;
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Apply filter
            ctx.filter = selectedFilter.filter;
            ctx.drawImage(img, 0, 0);
            
            // Add text overlays
            ctx.filter = 'none';
            textOverlays.forEach(overlay => {
              ctx.font = `bold ${overlay.size}px Inter`;
              ctx.fillStyle = overlay.color;
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 2;
              ctx.strokeText(overlay.text, (overlay.x / 100) * canvas.width, (overlay.y / 100) * canvas.height);
              ctx.fillText(overlay.text, (overlay.x / 100) * canvas.width, (overlay.y / 100) * canvas.height);
            });
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const editedFile = new File([blob], 'story.jpg', { type: 'image/jpeg' });
                await uploadToSupabase(editedFile);
              }
            }, 'image/jpeg', 0.9);
          }
        };
        img.src = mediaUrl;
      } else {
        // For video, upload original file for now
        await uploadToSupabase(mediaFile);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload your story",
        variant: "destructive"
      });
    }
    setIsUploading(false);
  };

  const uploadToSupabase = async (file: File) => {
    try {
      const result = await uploadMediaToSupabase(file, 'stories', {
        maxSizeMB: 50,
        folder: 'stories'
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      const contentType = file.type.startsWith('image/') ? 'image' : 'video';
      const { error } = await supabase
        .from('stories')
        .insert({
          creator_id: session!.user.id,
          media_url: result.url,
          content_type: contentType,
          is_public: true
        });

      if (error) throw error;

      toast({
        title: "Story Posted!",
        description: "Your story has been shared successfully",
      });

      window.dispatchEvent(new CustomEvent('story-uploaded'));
      onClose();
      resetState();
    } catch (error: any) {
      throw error;
    }
  };

  const resetState = () => {
    setMode('select');
    setMediaFile(null);
    setMediaUrl('');
    setSelectedFilter(filters[0]);
    setTextOverlays([]);
    setCurrentText('');
    setIsAddingText(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {mode === 'edit' && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMode('select')}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                onClick={uploadStory}
                disabled={isUploading}
                className="bg-primary hover:bg-primary/80"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="h-full flex items-center justify-center">
          {mode === 'select' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8"
            >
              <h2 className="text-white text-2xl font-bold mb-8">Create Your Story</h2>
              
              <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('camera')}
                  className="glass-card-heavy p-6 rounded-2xl text-white flex flex-col items-center gap-3"
                >
                  <Camera className="w-8 h-8 text-primary" />
                  <span className="font-medium">Take Photo</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-card-heavy p-6 rounded-2xl text-white flex flex-col items-center gap-3"
                >
                  <Image className="w-8 h-8 text-primary" />
                  <span className="font-medium">Choose from Gallery</span>
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

          {mode === 'camera' && (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-white rounded-full" />
                </motion.button>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {mode === 'edit' && mediaUrl && (
            <div className="relative w-full h-full max-w-sm mx-auto">
              {/* Media Display */}
              <div className="relative h-full">
                {mediaFile?.type.startsWith('image/') ? (
                  <img
                    src={mediaUrl}
                    alt="Story"
                    className="w-full h-full object-cover"
                    style={{ filter: selectedFilter.filter }}
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    style={{ filter: selectedFilter.filter }}
                    autoPlay
                    muted
                    loop
                  />
                )}
                
                {/* Text Overlays */}
                {textOverlays.map((overlay) => (
                  <motion.div
                    key={overlay.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute cursor-move"
                    style={{
                      left: `${overlay.x}%`,
                      top: `${overlay.y}%`,
                      color: overlay.color,
                      fontSize: `${overlay.size}px`,
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                    onClick={() => removeTextOverlay(overlay.id)}
                  >
                    {overlay.text}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {filters.map((filter) => (
                    <motion.button
                      key={filter.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                        selectedFilter.name === filter.name
                          ? 'bg-primary text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {filter.name}
                    </motion.button>
                  ))}
                </div>

                {/* Tools */}
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAddingText(true)}
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Type className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {/* Text Input Modal */}
                {isAddingText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/50 p-4 rounded-lg"
                  >
                    <input
                      type="text"
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      placeholder="Add text..."
                      className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60 border-none outline-none"
                      autoFocus
                    />
                    
                    <div className="flex gap-2 mt-3 mb-3">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCurrentTextColor(color)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            currentTextColor === color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={addTextOverlay}
                        size="sm"
                        className="flex-1"
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => setIsAddingText(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};