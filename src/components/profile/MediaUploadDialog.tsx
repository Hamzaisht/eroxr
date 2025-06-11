
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Camera, Image as ImageIcon, Play, Video, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface MediaUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'avatar' | 'banner';
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const MediaUploadDialog = ({
  isOpen,
  onClose,
  type,
  currentUrl,
  onUpload,
  isUploading
}: MediaUploadDialogProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'banner' 
      ? {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
          'video/*': ['.mp4', '.webm', '.mov']
        }
      : {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async () => {
    if (selectedFile && !isUploading) {
      try {
        await onUpload(selectedFile);
        handleClose();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setPreview(null);
      setSelectedFile(null);
      setFileType(null);
      onClose();
    }
  };

  const isAvatar = type === 'avatar';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-none bg-transparent overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full bg-gradient-to-br from-luxury-dark via-luxury-darker to-luxury-dark backdrop-blur-xl border border-luxury-primary/30 shadow-2xl rounded-3xl overflow-hidden"
        >
          {/* Divine Header with Mythological Elements */}
          <div className="relative p-8 pb-6 bg-gradient-to-r from-luxury-primary/10 via-luxury-accent/5 to-luxury-primary/10 border-b border-luxury-primary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.1),transparent_70%)]" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {isAvatar ? <Camera className="w-7 h-7 text-luxury-primary" /> : <ImageIcon className="w-7 h-7 text-luxury-primary" />}
                  </motion.div>
                  {/* Divine energy rings */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-luxury-primary/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent">
                    Divine {isAvatar ? 'Avatar' : 'Banner'} Studio
                  </h2>
                  <p className="text-luxury-muted">Channel Eros's creative essence through sacred media</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isUploading}
                className="text-luxury-muted hover:text-luxury-neutral rounded-xl hover:bg-luxury-primary/10 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            {/* Current/Preview Media */}
            <AnimatePresence mode="wait">
              {(currentUrl || preview) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div className={cn(
                    "mx-auto overflow-hidden border-2 border-luxury-primary/30 bg-luxury-darker/50 relative group backdrop-blur-sm",
                    isAvatar ? "w-40 h-40 rounded-full" : "w-full h-56 rounded-3xl"
                  )}>
                    {preview && fileType === 'video' ? (
                      <video
                        src={preview}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={preview || currentUrl}
                        alt={isAvatar ? "Avatar preview" : "Banner preview"}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {fileType === 'video' && (
                      <div className="absolute top-3 right-3 bg-black/70 rounded-xl px-3 py-1 flex items-center gap-2">
                        <Play className="w-3 h-3 text-white" />
                        <span className="text-xs text-white font-medium">ETERNAL LOOP</span>
                      </div>
                    )}
                    {/* Divine aura effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/10 via-transparent to-luxury-accent/10 opacity-50" />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-luxury-muted mt-4 font-medium"
                  >
                    {preview ? '✨ New divine essence awaits' : '🏛️ Current sacred media'}
                    {fileType === 'video' && ' • Eternal video loop'}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div
                {...getRootProps()}
                className={cn(
                  "relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 group overflow-hidden backdrop-blur-sm",
                  isDragActive
                    ? "border-luxury-primary bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/10 scale-[1.02] shadow-2xl"
                    : "border-luxury-primary/30 hover:border-luxury-primary/60 hover:bg-gradient-to-br hover:from-luxury-primary/10 hover:to-luxury-accent/5",
                  isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <input {...getInputProps()} />
                
                {/* Mythological background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-luxury-primary rounded-full" />
                  <div className="absolute top-8 right-8 w-6 h-6 border-2 border-luxury-accent rounded-full" />
                  <div className="absolute bottom-6 left-12 w-4 h-4 border-2 border-luxury-primary rounded-full" />
                  <div className="absolute bottom-12 right-6 w-10 h-10 border-2 border-luxury-accent rounded-full" />
                </div>
                
                <div className="relative space-y-8">
                  {isUploading ? (
                    <div className="relative w-20 h-20 mx-auto">
                      {/* Futuristic Neural Network Upload Animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-luxury-primary/30"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      />
                      <motion.div
                        className="absolute inset-2 rounded-full border-2 border-luxury-accent/50"
                        animate={{
                          rotate: -360,
                          scale: [0.9, 1.2, 0.9],
                        }}
                        transition={{
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                      />
                      <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-luxury-primary to-luxury-accent"
                        animate={{
                          scale: [0.8, 1.3, 0.8],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {/* Neural network nodes */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-luxury-primary rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            originX: 0.5,
                            originY: 0.5,
                          }}
                          animate={{
                            x: Math.cos(i * 60 * Math.PI / 180) * 35,
                            y: Math.sin(i * 60 * Math.PI / 180) * 35,
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                        className="w-16 h-16 text-luxury-primary/80 relative"
                      >
                        {isAvatar ? <Camera className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
                        <motion.div
                          className="absolute inset-0 bg-luxury-primary/20 rounded-full blur-xl"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      {!isAvatar && (
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: -10, y: -5 }}
                          className="w-16 h-16 text-luxury-accent/80 relative"
                        >
                          <Video className="w-full h-full" />
                          <motion.div
                            className="absolute inset-0 bg-luxury-accent/20 rounded-full blur-xl"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-luxury-neutral">
                      {isUploading ? '🌌 Transcending to Digital Olympus...' : 
                       isDragActive ? '⚡ Release the Divine Essence!' : 
                       '🏛️ Upload Sacred Media to Eros\'s Realm'}
                    </h3>
                    <p className="text-luxury-muted text-lg">
                      {isUploading 
                        ? 'Your media is being blessed by the gods of creativity'
                        : isDragActive 
                        ? 'Let divine inspiration flow through the cosmic channels'
                        : 'Drag and drop your offering or click to select from your mortal device'
                      }
                    </p>
                    {!isAvatar && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-6 text-sm text-luxury-muted/80"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-primary/10 border border-luxury-primary/20">
                          <ImageIcon className="w-4 h-4" />
                          <span>Sacred Images</span>
                        </div>
                        <div className="w-2 h-2 bg-luxury-muted/40 rounded-full" />
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-accent/10 border border-luxury-accent/20">
                          <Video className="w-4 h-4" />
                          <span>Eternal Video Loops</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {!isUploading && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-luxury-primary/40 bg-luxury-dark/60 text-luxury-primary hover:bg-luxury-primary/15 rounded-2xl px-10 py-4 backdrop-blur-sm font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Upload className="w-6 h-6 mr-3" />
                        Choose Divine Media
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Format Info with Greek Aesthetic */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-6 text-sm"
            >
              <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-primary/20 backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-luxury-primary/20 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-luxury-primary" />
                </div>
                <div className="font-bold text-luxury-neutral mb-2 text-lg">Sacred Images</div>
                <div className="text-luxury-muted mb-2">JPG, PNG, GIF, WebP</div>
                <div className="text-luxury-muted/70 text-xs">
                  {isAvatar ? '🔮 Perfect circles honor divine symmetry' : '🏛️ Recommended: 1500x500px for optimal viewing'}
                </div>
              </div>
              {!isAvatar && (
                <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-accent/20 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 bg-luxury-accent/20 rounded-2xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-luxury-accent" />
                  </div>
                  <div className="font-bold text-luxury-neutral mb-2 text-lg">Living Art</div>
                  <div className="text-luxury-muted mb-2">MP4, WebM, MOV</div>
                  <div className="text-luxury-muted/70 text-xs">⚡ Eternal loops of divine beauty</div>
                </div>
              )}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6 pt-6"
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 border-luxury-neutral/30 text-luxury-neutral hover:bg-luxury-neutral/10 rounded-2xl h-14 text-lg font-medium transition-all duration-300"
              >
                Abandon Quest
              </Button>
              <motion.div className="flex-1">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={cn(
                    "w-full bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary hover:from-luxury-primary/90 hover:via-luxury-accent/90 hover:to-luxury-primary/90 text-white rounded-2xl h-14 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden",
                    isUploading && "animate-none"
                  )}
                >
                  {/* Button background animation */}
                  {!isUploading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 via-luxury-accent/20 to-luxury-primary/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center">
                    {isUploading ? (
                      <>
                        <motion.div
                          className="w-6 h-6 mr-3 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Ascending to Olympus...
                      </>
                    ) : selectedFile ? (
                      <>
                        <CheckCircle className="w-6 h-6 mr-3" />
                        Bless {fileType === 'video' ? 'Sacred Video' : 'Divine Image'}
                      </>
                    ) : (
                      'Select Divine Media'
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
