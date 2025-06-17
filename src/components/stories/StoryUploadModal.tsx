
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Video, Crown, Sparkles, Clock, Camera, Play, Zap } from "lucide-react";
import { useStoryUpload } from "@/hooks/useStoryUpload";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryUploadModal = ({ open, onOpenChange }: StoryUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(10); // Default 10 seconds
  const { uploadStory, uploading, uploadProgress } = useStoryUpload();

  const durationOptions = [
    { value: 5, label: "5s", description: "Quick moment", icon: Sparkles },
    { value: 10, label: "10s", description: "Standard story", icon: Clock },
    { value: 30, label: "30s", description: "Extended story", icon: Crown }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // For videos, duration selection is not needed as it uses the video's natural duration
    if (isVideo) {
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        const videoDuration = Math.ceil(video.duration);
        setSelectedDuration(videoDuration);
      };
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadStory(selectedFile, selectedDuration);
    
    if (result.success) {
      // Close modal and refresh stories
      handleClose();
      window.dispatchEvent(new CustomEvent('story-uploaded'));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedDuration(10); // Reset to default
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onOpenChange(false);
  };

  const isVideo = selectedFile?.type.startsWith('video/');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-transparent border-0 p-0 shadow-none">
        <motion.div 
          className="relative futuristic-container"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main container with RGB border lighting */}
          <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10">
            {/* Animated RGB border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 via-yellow-400 to-cyan-400 opacity-60 animate-[spin_8s_linear_infinite] blur-sm"></div>
            <div className="absolute inset-[2px] rounded-2xl bg-black/90 backdrop-blur-3xl"></div>
            
            {/* Content container */}
            <div className="relative z-10">
              {/* Holographic background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 via-pink-500/5 to-yellow-500/5 rounded-2xl" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/80 to-transparent" />
              
              {/* Floating energy particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `linear-gradient(45deg, ${['#00f5ff', '#ff00f5', '#f5ff00', '#00ff5f'][i % 4]}, transparent)`,
                      left: `${10 + i * 8}%`,
                      top: `${15 + (i % 4) * 20}%`,
                    }}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, 20, 0],
                      opacity: [0.2, 1, 0.2],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 6 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              
              {/* Header */}
              <motion.div 
                className="relative flex items-center justify-between p-8 pb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                  >
                    <Crown className="w-8 h-8 text-cyan-400" />
                    <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                      Create Story
                    </h2>
                    <p className="text-sm text-white/60 font-light">Share your cosmic moment with the universe</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Content with custom scrollbar */}
              <motion.div 
                className="relative px-8 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {!selectedFile ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Media Upload Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-pink-400" />
                          <label className="text-lg font-semibold text-white">Quantum Media Portal</label>
                        </div>
                        
                        <div className="relative bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                          {/* RGB border for upload area */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-sm"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-white/60">Neural Interface</span>
                              <div className="flex gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => document.getElementById('story-upload')?.click()}
                                  className="text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded-full"
                                >
                                  <Image className="h-4 w-4 mr-2" />
                                  Photo
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => document.getElementById('story-upload')?.click()}
                                  className="text-purple-400 hover:bg-purple-400/10 transition-all duration-300 rounded-full"
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Video
                                </Button>
                              </div>
                            </div>

                            {/* Upload Drop Zone */}
                            <div 
                              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400/40 transition-all duration-500 bg-gradient-to-br from-white/5 to-transparent"
                              onClick={() => document.getElementById('story-upload')?.click()}
                            >
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Upload className="mx-auto h-12 w-12 text-white/40 mb-4" />
                              </motion.div>
                              <p className="text-white/60 mb-2 text-lg">Share Your Moment</p>
                              <p className="text-white/40 text-sm">Upload photos or videos to create an engaging story that lasts 24 hours</p>
                              <p className="text-white/30 text-xs mt-4">Max 100MB • Photos & Videos • Visible for 24 hours</p>
                            </div>

                            {/* Hidden file input */}
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="story-upload"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Preview */}
                      <div className="relative bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 blur-sm"></div>
                        <div className="relative p-6">
                          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[9/16] max-h-96 shadow-2xl">
                            {isVideo ? (
                              <video
                                src={previewUrl || undefined}
                                className="w-full h-full object-cover"
                                controls
                                muted
                              />
                            ) : (
                              <img
                                src={previewUrl || undefined}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedFile(null);
                                if (previewUrl) {
                                  URL.revokeObjectURL(previewUrl);
                                  setPreviewUrl(null);
                                }
                              }}
                              className="absolute top-4 right-4 p-2 bg-black/70 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>

                            {/* Media type indicator */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-2">
                              {isVideo ? <Play className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                              {isVideo ? 'Video' : 'Photo'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Duration Selection for Images */}
                      {!isVideo && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4 bg-black/20 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-pink-400/5 rounded-2xl"></div>
                          <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                              <Clock className="w-5 h-5 text-cyan-400" />
                              <span className="text-lg font-semibold text-white">Story Duration</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {durationOptions.map((option, index) => {
                                const IconComponent = option.icon;
                                return (
                                  <motion.button
                                    key={option.value}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDuration(option.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                      selectedDuration === option.value
                                        ? 'bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-cyan-400/60 text-white shadow-lg shadow-cyan-400/25'
                                        : 'bg-black/30 border-white/20 text-white/80 hover:border-cyan-400/40 hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex flex-col items-center gap-2">
                                      <IconComponent className="w-5 h-5" />
                                      <div className="text-lg font-bold">{option.label}</div>
                                      <div className="text-xs opacity-80">{option.description}</div>
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Video Duration Info */}
                      {isVideo && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-black/20 border border-white/10 p-4 rounded-xl backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3 text-cyan-400">
                            <Video className="w-5 h-5" />
                            <span className="font-semibold text-white">Video Story</span>
                          </div>
                          <p className="text-sm text-white/60 mt-2">
                            Videos longer than 30 seconds will be automatically split into 30-second segments
                          </p>
                        </motion.div>
                      )}

                      {/* Upload Progress */}
                      {uploading && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-3 bg-black/20 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-400 font-semibold">Uploading your cosmic story...</span>
                            <span className="text-cyan-400 font-bold">{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="w-full h-2" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Footer */}
              <motion.div 
                className="flex justify-end gap-4 p-8 pt-6 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={uploading}
                  className="border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-full"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className={`relative overflow-hidden transition-all duration-300 rounded-full ${
                    selectedFile && !uploading
                      ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Animated background for enabled state */}
                  {selectedFile && !uploading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                      animate={{ 
                        background: [
                          'linear-gradient(to right, #00f5ff, #8b5cf6, #f472b6)',
                          'linear-gradient(to right, #f472b6, #00f5ff, #8b5cf6)',
                          'linear-gradient(to right, #8b5cf6, #f472b6, #00f5ff)',
                          'linear-gradient(to right, #00f5ff, #8b5cf6, #f472b6)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-2">
                    {uploading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="h-4 w-4" />
                        </motion.div>
                        Manifesting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Share Story
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
