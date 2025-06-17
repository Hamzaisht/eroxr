
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Video, Crown, Sparkles, Clock, Camera, Play } from "lucide-react";
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
      <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <DialogHeader className="relative z-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-7 h-7 text-amber-500" />
              </motion.div>
              Create Story
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
              </motion.div>
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <div className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 group">
                  <motion.div
                    className="flex justify-center space-x-6 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg"
                    >
                      <Image className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg"
                    >
                      <Video className="w-8 h-8 text-purple-600" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Share Your Moment
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      Upload photos or videos to create an engaging story that lasts 24 hours
                    </p>
                    
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="story-upload"
                    />
                    <motion.label
                      htmlFor="story-upload"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl group-hover:shadow-blue-500/25"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Media
                    </motion.label>
                  </motion.div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-500 mt-6"
                  >
                    Max 100MB • Photos & Videos • Visible for 24 hours
                  </motion.p>
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
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-[9/16] max-h-96 shadow-2xl">
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

                {/* Duration Selection for Images */}
                {!isVideo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 bg-gray-50 p-6 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-800">Story Duration</span>
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
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 text-white shadow-lg'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
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
                  </motion.div>
                )}

                {/* Video Duration Info */}
                {isVideo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 p-4 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center gap-3 text-blue-700">
                      <Video className="w-5 h-5" />
                      <span className="font-semibold">Video Story</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      Videos longer than 30 seconds will be automatically split into 30-second segments
                    </p>
                  </motion.div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-semibold">Uploading your story...</span>
                      <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full h-2" />
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex space-x-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {uploading ? 'Uploading...' : 'Share Story'}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={uploading}
                      className="px-6 py-3 border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
