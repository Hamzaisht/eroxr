
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Globe, Upload, Image, Video, Camera, Zap } from "lucide-react";
import { useRef, useState } from "react";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect?: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles,
  onFileSelect 
}: CreatePostDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    content,
    setContent,
    visibility,
    setVisibility,
    isLoading,
    uploadedAssetIds,
    uploadInProgress,
    uploadError,
    uploadSuccess,
    characterLimit,
    charactersUsed,
    canSubmit,
    handleMediaUploadComplete,
    handleMediaUploadStart,
    createPost,
    resetForm
  } = useCreatePost();

  const handleSubmit = async () => {
    if (!canSubmit) {
      console.log("Cannot submit - validation failed");
      return;
    }
    await createPost(() => {
      onOpenChange(false);
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleMediaSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && onFileSelect) {
      onFileSelect(files);
    }
  };

  const handleVisibilityChange = (value: string) => {
    setVisibility(value as "public" | "subscribers_only" | "private" | "hidden");
  };

  // Enhanced submit validation for debugging
  const isContentValid = content.trim().length > 0 || uploadedAssetIds.length > 0;
  const canActuallySubmit = !isLoading && !uploadInProgress && !uploadError && isContentValid && charactersUsed <= characterLimit;

  console.log("Submit validation:", {
    isLoading,
    uploadInProgress,
    uploadError,
    isContentValid,
    charactersUsed,
    characterLimit,
    canSubmit: canActuallySubmit
  });

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
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                    <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                      Create New Post
                    </h2>
                    <p className="text-sm text-white/60 font-light">Unleash your creative vision to the cosmos</p>
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
                {/* Post Content Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <label className="text-lg font-semibold text-white">What's illuminating your mind?</label>
                  </div>
                  <div className="relative">
                    <Textarea
                      placeholder="Share your cosmic thoughts and creative energy..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[140px] bg-black/30 border border-white/20 text-white placeholder:text-white/40 resize-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
                      maxLength={characterLimit}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-white/50 font-mono">
                      <span className={charactersUsed > characterLimit * 0.9 ? 'text-yellow-400' : charactersUsed > characterLimit * 0.95 ? 'text-red-400' : ''}>
                        {charactersUsed}
                      </span>
                      /{characterLimit}
                    </div>
                  </div>
                </div>

                {/* Visibility Section */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <label className="text-lg font-semibold text-white">Visibility Spectrum</label>
                  </div>
                  <Select value={visibility} onValueChange={handleVisibilityChange}>
                    <SelectTrigger className="bg-black/30 border border-white/20 text-white hover:border-purple-400/60 transition-all duration-300 rounded-xl backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/20 backdrop-blur-xl rounded-xl">
                      <SelectItem value="public" className="text-white hover:bg-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4" />
                          Public - Broadcast to the universe
                        </div>
                      </SelectItem>
                      <SelectItem value="private" className="text-white hover:bg-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <X className="w-4 h-4" />
                          Private - Personal cosmic vault
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Media Upload Section */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
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
                            onClick={handleMediaSelect}
                            className="text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded-full"
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Photo
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMediaSelect}
                            className="text-purple-400 hover:bg-purple-400/10 transition-all duration-300 rounded-full"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Video
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMediaSelect}
                            className="text-pink-400 hover:bg-pink-400/10 transition-all duration-300 rounded-full"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture
                          </Button>
                        </div>
                      </div>

                      {/* Upload Drop Zone */}
                      <div 
                        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400/40 transition-all duration-500 bg-gradient-to-br from-white/5 to-transparent"
                        onClick={handleMediaSelect}
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Upload className="mx-auto h-12 w-12 text-white/40 mb-4" />
                        </motion.div>
                        <p className="text-white/60 mb-2 text-lg">Drag & drop your cosmic creations</p>
                        <p className="text-white/40 text-sm">or click to browse the quantum realm</p>
                      </div>

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </motion.div>
                
                {selectedFiles && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <MediaUploadDisplay
                      selectedFiles={selectedFiles}
                      onUploadComplete={handleMediaUploadComplete}
                      onUploadStart={handleMediaUploadStart}
                      uploadInProgress={uploadInProgress}
                      uploadError={uploadError}
                      uploadSuccess={uploadSuccess}
                      uploadedAssetIds={uploadedAssetIds}
                    />
                  </motion.div>
                )}
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
                  disabled={isLoading}
                  className="border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-full"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!canActuallySubmit}
                  className={`relative overflow-hidden transition-all duration-300 rounded-full ${
                    canActuallySubmit 
                      ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-105 shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Animated background for enabled state */}
                  {canActuallySubmit && (
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
                    {isLoading ? (
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
                        Launch Creation
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
