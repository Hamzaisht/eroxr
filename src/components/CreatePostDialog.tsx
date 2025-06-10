
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden bg-slate-900/95 border border-cyan-500/20 backdrop-blur-xl shadow-2xl p-0">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Premium background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-lg" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          {/* Floating particles animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-40"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${10 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Header */}
          <motion.div 
            className="relative flex items-center justify-between p-6 pb-4 border-b border-cyan-500/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Create New Post
                </h2>
                <p className="text-sm text-slate-400">Share your creative vision with the world</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-slate-400 hover:bg-slate-800/50 transition-all duration-200 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="relative px-6 space-y-6 max-h-[70vh] overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Post Content Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <label className="text-sm font-medium text-white">What's on your mind?</label>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Share something amazing..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 resize-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200"
                  maxLength={characterLimit}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {charactersUsed}/{characterLimit}
                </div>
              </div>
            </div>

            {/* Visibility Section */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <label className="text-sm font-medium text-white">Post Visibility</label>
              </div>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="bg-slate-800/50 border border-slate-700/50 text-white hover:border-purple-400/50 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-slate-700">
                  <SelectItem value="public" className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public - Everyone can see this post
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="text-white hover:bg-slate-700">
                    Private - Only you can see this post
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Media Upload Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-400" />
                <label className="text-sm font-medium text-white">Add Media</label>
              </div>
              
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">Choose Files</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMediaSelect}
                      className="text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMediaSelect}
                      className="text-purple-400 hover:bg-purple-400/10 transition-all duration-200"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMediaSelect}
                      className="text-pink-400 hover:bg-pink-400/10 transition-all duration-200"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Camera
                    </Button>
                  </div>
                </div>

                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-slate-600/50 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
                  onClick={handleMediaSelect}
                >
                  <Upload className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400 mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-slate-500">Optimizing your media for best quality</p>
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
            </motion.div>
            
            {selectedFiles && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
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
            className="flex justify-end gap-3 p-6 pt-4 border-t border-cyan-500/10 bg-slate-900/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-200"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                  Creating...
                </motion.div>
              ) : (
                "Create Post"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
