
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Globe, Upload, Image, Video, Camera, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRef, useState, useEffect } from "react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { MediaUploadService } from "@/services/mediaUploadService";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect?: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles: externalSelectedFiles,
  onFileSelect 
}: CreatePostDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(externalSelectedFiles || null);
  const [isUploading, setIsUploading] = useState(false);
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
    const newFiles = e.target.files;
    if (newFiles) {
      // Combine existing files with new files instead of replacing
      if (selectedFiles && selectedFiles.length > 0) {
        const existingArray = Array.from(selectedFiles);
        const newArray = Array.from(newFiles);
        const combinedArray = [...existingArray, ...newArray];
        
        // Create new FileList-like object
        const dt = new DataTransfer();
        combinedArray.forEach(file => dt.items.add(file));
        setSelectedFiles(dt.files);
        
        if (onFileSelect) {
          onFileSelect(dt.files);
        }
      } else {
        setSelectedFiles(newFiles);
        if (onFileSelect) {
          onFileSelect(newFiles);
        }
      }
    }
  };

  // REAL media upload - production ready
  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0 && user?.id) {
      handleRealMediaUpload();
    }
  }, [selectedFiles, user?.id]);

  const handleRealMediaUpload = async () => {
    if (!selectedFiles || !user?.id) return;

    setIsUploading(true);
    handleMediaUploadStart();

    try {
      const fileArray = Array.from(selectedFiles);
      console.log("CreatePostDialog - Starting real media upload:", fileArray.length, "files");

      // Upload files using the real MediaUploadService
      const uploadResult = await MediaUploadService.uploadFiles(fileArray, user.id);

      if (uploadResult.success && uploadResult.assetIds.length > 0) {
        console.log("CreatePostDialog - Real upload successful:", {
          assetIds: uploadResult.assetIds,
          urls: uploadResult.urls
        });
        
        handleMediaUploadComplete(uploadResult.urls, uploadResult.assetIds);
      } else {
        throw new Error(uploadResult.error || "Upload failed");
      }
      
    } catch (error: any) {
      console.error("CreatePostDialog - Real upload failed:", error);
      handleMediaUploadComplete([], []); // Reset on error
    } finally {
      setIsUploading(false);
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

                       {selectedFiles && selectedFiles.length > 0 ? (
                        <div className="rounded-2xl bg-gradient-to-br from-cyan-400/5 to-purple-400/5 min-h-[400px] flex flex-col bg-black/10 backdrop-blur-sm transition-all duration-500">{/* Instant media preview with dimmed overlay during processing */}
                          {uploadInProgress && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] rounded-2xl z-10 transition-all duration-200" />
                          )}
                          
                          {/* Dynamic Fullscreen Media Layout */}
                          {!uploadInProgress && (
                            <div className="flex-1 h-full">
                              {selectedFiles.length === 1 ? (
                                /* Single media: Large preview + small add more button */
                                <div className="grid grid-cols-4 gap-2 h-full">
                                  <div className="col-span-3">
                                    {(() => {
                                      const file = selectedFiles[0];
                                      return (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.4 }}
                                          className="relative w-full h-full overflow-hidden bg-black/10 group hover:bg-black/20 transition-all duration-300 rounded-l-2xl"
                                        >
                                           {file.type.startsWith('image/') ? (
                                             <div className="w-full h-full relative">
                                               <img
                                                 src={URL.createObjectURL(file)}
                                                 alt="Main preview"
                                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                               />
                                               {/* Loading circle during upload - only show when actually uploading */}
                                               {isUploading && (
                                                 <motion.div 
                                                   className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400/90 backdrop-blur-sm flex items-center justify-center z-20"
                                                   animate={{ rotate: 360 }}
                                                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                 >
                                                   <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                 </motion.div>
                                               )}
                                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                             </div>
                                           ) : file.type.startsWith('video/') ? (
                                              <div className="w-full h-full relative">
                                                <video
                                                  src={URL.createObjectURL(file)}
                                                  className="w-full h-full object-cover"
                                                  muted
                                                  loop
                                                  autoPlay
                                                  playsInline
                                                />
                                                {/* Loading circle during upload - only show when actually uploading */}
                                                {isUploading && (
                                                  <motion.div 
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400/90 backdrop-blur-sm flex items-center justify-center z-20"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                  >
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                  </motion.div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm rounded-full p-2">
                                                  <Video className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                                                  <span className="text-white/90 text-sm font-medium">∞ Auto Loop</span>
                                                </div>
                                              </div>
                                           ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                              <Image className="h-20 w-20 text-pink-400 opacity-60" />
                                            </div>
                                          )}
                                          
                                          {/* File info overlay */}
                                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-semibold truncate">{file.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                              <p className="text-white/70 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                              <span className="text-cyan-400 text-xs px-2 py-1 bg-cyan-400/20 rounded-full">
                                                {file.type.startsWith('video/') ? 'Video' : 'Image'}
                                              </span>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })()}
                                  </div>
                                  
                                  {/* Small add more button */}
                                  <div className="col-span-1">
                                    <motion.div 
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.4, delay: 0.2 }}
                                      className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm text-center cursor-pointer hover:from-cyan-400/10 hover:to-purple-400/10 transition-all duration-300 group flex flex-col items-center justify-center border border-white/10 hover:border-cyan-400/30 rounded-r-2xl"
                                      onClick={handleMediaSelect}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: [0, 180, 360] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="group-hover:text-cyan-400 transition-colors duration-300 mb-3"
                                      >
                                        <Upload className="h-8 w-8" />
                                      </motion.div>
                                      <p className="text-white/70 text-sm font-medium group-hover:text-white/90 transition-colors duration-300 text-center px-2">
                                        Add More
                                      </p>
                                    </motion.div>
                                  </div>
                                </div>
                              ) : selectedFiles.length >= 2 ? (
                                /* Multiple media: First large, others smaller */
                                <div className="grid grid-cols-2 gap-2 h-full">
                                  {/* First media - large */}
                                  <div className="row-span-2">
                                    {(() => {
                                      const file = selectedFiles[0];
                                      return (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.4 }}
                                          className="relative w-full h-full overflow-hidden bg-black/10 group hover:bg-black/20 transition-all duration-300 rounded-l-2xl"
                                        >
                                          {file.type.startsWith('image/') ? (
                                            <div className="w-full h-full relative">
                                              <img
                                                src={URL.createObjectURL(file)}
                                                alt="Main preview"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                          ) : file.type.startsWith('video/') ? (
                                            <div className="w-full h-full relative">
                                              <video
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                              />
                                              <div className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm rounded-full p-2">
                                                <Video className="h-5 w-5 text-white" />
                                              </div>
                                              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                                                <span className="text-white/90 text-sm font-medium">∞ Auto Loop</span>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                              <Image className="h-16 w-16 text-pink-400 opacity-60" />
                                            </div>
                                          )}
                                          
                                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-semibold truncate text-sm">{file.name}</p>
                                            <p className="text-white/70 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                          </div>
                                        </motion.div>
                                      );
                                    })()}
                                  </div>
                                  
                                  {/* Right column - smaller media items */}
                                  <div className="grid grid-rows-2 gap-2 h-full">
                                    {/* Second media */}
                                    {selectedFiles[1] && (
                                      <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="relative overflow-hidden bg-black/10 group hover:bg-black/20 transition-all duration-300 rounded-tr-2xl"
                                      >
                                        {selectedFiles[1].type.startsWith('image/') ? (
                                          <img
                                            src={URL.createObjectURL(selectedFiles[1])}
                                            alt="Preview 2"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                          />
                                        ) : selectedFiles[1].type.startsWith('video/') ? (
                                          <div className="w-full h-full relative">
                                            <video
                                              src={URL.createObjectURL(selectedFiles[1])}
                                              className="w-full h-full object-cover"
                                              muted
                                              loop
                                              autoPlay
                                              playsInline
                                            />
                                            <div className="absolute top-2 right-2 bg-purple-500/90 rounded-full p-1">
                                              <Video className="h-3 w-3 text-white" />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                            <Image className="h-8 w-8 text-pink-400" />
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                    
                                    {/* Third media or Add More button */}
                                    {selectedFiles[2] ? (
                                      <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="relative overflow-hidden bg-black/10 group hover:bg-black/20 transition-all duration-300 rounded-br-2xl"
                                      >
                                        {selectedFiles[2].type.startsWith('image/') ? (
                                          <img
                                            src={URL.createObjectURL(selectedFiles[2])}
                                            alt="Preview 3"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                          />
                                        ) : selectedFiles[2].type.startsWith('video/') ? (
                                          <div className="w-full h-full relative">
                                            <video
                                              src={URL.createObjectURL(selectedFiles[2])}
                                              className="w-full h-full object-cover"
                                              muted
                                              loop
                                              autoPlay
                                              playsInline
                                            />
                                            <div className="absolute top-2 right-2 bg-purple-500/90 rounded-full p-1">
                                              <Video className="h-3 w-3 text-white" />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                            <Image className="h-8 w-8 text-pink-400" />
                                          </div>
                                        )}
                                      </motion.div>
                                    ) : (
                                      /* Add More button when only 2 media */
                                      <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm text-center cursor-pointer hover:from-cyan-400/10 hover:to-purple-400/10 transition-all duration-300 group flex flex-col items-center justify-center border border-white/10 hover:border-cyan-400/30 rounded-br-2xl"
                                        onClick={handleMediaSelect}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <Upload className="h-6 w-6 group-hover:text-cyan-400 transition-colors duration-300 mb-2" />
                                        <p className="text-white/70 text-xs font-medium group-hover:text-white/90 transition-colors duration-300">
                                          Add More
                                        </p>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-cyan-400/40 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400/60 transition-all duration-500 bg-gradient-to-br from-white/5 to-transparent min-h-[400px] flex items-center justify-center"
                          onClick={handleMediaSelect}
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Upload className="mx-auto h-12 w-12 text-white/40 mb-4" />
                            <p className="text-white/60 mb-2 text-lg">Drag & drop your cosmic creations</p>
                            <p className="text-white/40 text-sm">or click to browse the quantum realm</p>
                          </motion.div>
                        </div>
                      )}

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
