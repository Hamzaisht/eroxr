
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Image, Video, Mic, X, Upload, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaUploadDisplayProps {
  selectedFiles: FileList | null;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadInProgress: boolean;
  uploadedAssetIds: string[];
  onUploadComplete: (urls: string[], assetIds: string[]) => void;
  onUploadStart: () => void;
}

export const MediaUploadDisplay = ({
  selectedFiles,
  uploadError,
  uploadSuccess,
  uploadInProgress,
  uploadedAssetIds,
  onUploadComplete,
  onUploadStart
}: MediaUploadDisplayProps) => {
  const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { uploadMultiple } = useMediaUpload();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Create preview URLs for selected files
    if (selectedFiles) {
      const previews: {[key: string]: string} = {};
      Array.from(selectedFiles).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          previews[`${file.name}-${index}`] = URL.createObjectURL(file);
        }
      });
      setFilePreviews(previews);

      // Auto-upload files when selected
      handleUpload();
    }

    // Cleanup preview URLs
    return () => {
      Object.values(filePreviews).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    console.log("📤 MediaUploadDisplay - Starting upload for", selectedFiles.length, "files");
    onUploadStart();

    try {
      const filesArray = Array.from(selectedFiles);
      const results = await uploadMultiple(filesArray, {
        contentCategory: 'posts',
        accessLevel: 'public',
        metadata: { 
          usage: 'post',
          upload_timestamp: new Date().toISOString(),
          upload_session: Date.now()
        }
      });

      console.log("📊 MediaUploadDisplay - Upload results:", results);

      const successfulUploads = results.filter(r => r.success && r.url && r.assetId);
      
      if (successfulUploads.length === 0) {
        throw new Error("All uploads failed");
      }
      
      const urls = successfulUploads.map(r => r.url!);
      const assetIds = successfulUploads.map(r => r.assetId!);
      
      console.log("✅ MediaUploadDisplay - Upload completed successfully:", {
        urls: urls.length,
        assetIds: assetIds.length
      });

      onUploadComplete(urls, assetIds);
      
    } catch (error) {
      console.error('💥 MediaUploadDisplay - Upload error:', error);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-cyan-400" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-5 h-5 text-pink-400" />;
    return <Upload className="w-5 h-5 text-blue-400" />;
  };

  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[400px] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl mx-auto space-y-6"
      >
        {/* Dynamic background glow following mouse */}
        <motion.div
          className="absolute -inset-10 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl opacity-60"
          animate={{
            x: (mousePosition.x - window.innerWidth / 2) * 0.02,
            y: (mousePosition.y - window.innerHeight / 2) * 0.02,
            rotate: [0, 1, -1, 0],
          }}
          transition={{ 
            x: { type: "spring", stiffness: 50, damping: 30 },
            y: { type: "spring", stiffness: 50, damping: 30 },
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-4"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
            padding: "2px",
            borderRadius: "1.5rem",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl" />
        </motion.div>

        {/* Main content container */}
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-2xl border border-gray-700/50 overflow-hidden p-8">
          
          {/* Floating particles */}
          <AnimatePresence>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(45deg, ${
                    i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'
                  }, transparent)`,
                  left: `${20 + i * 15}%`,
                  top: `${15 + (i % 2) * 70}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </AnimatePresence>

          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: '200% auto',
                  }}
                >
                  Media Upload Portal
                </motion.h2>
                <p className="text-gray-300">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} ready for processing
                </p>
              </div>
            </div>
          </motion.div>

          {/* Status Messages */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 p-4 mb-4"
                >
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-red-300">Upload Failed</p>
                      <p className="text-sm text-red-400">{uploadError}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {uploadSuccess && !uploadInProgress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-900/20 to-emerald-800/20 border border-green-500/30 p-4 mb-4"
                >
                  <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-300">Upload Complete!</p>
                      <p className="text-sm text-green-400">
                        {uploadedAssetIds.length} media file(s) ready to post
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {uploadInProgress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-800/20 border border-blue-500/30 p-4 mb-4"
                >
                  <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                      <Upload className="h-5 w-5 text-blue-400 animate-bounce" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-300">Processing Upload...</p>
                      <p className="text-sm text-blue-400">Optimizing your media for best quality</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* File Previews Grid - Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
              {Array.from(selectedFiles).map((file, index) => {
                const previewKey = `${file.name}-${index}`;
                const preview = filePreviews[previewKey];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/30 p-4 hover:border-cyan-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Ambient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative space-y-3">
                      {/* File Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {getFileIcon(file)}
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                          {uploadSuccess && (
                            <motion.div 
                              className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </motion.div>
                          )}
                          
                          {uploadInProgress && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20">
                              <Upload className="w-4 h-4 text-blue-400 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Image Preview */}
                      {preview && (
                        <div className="relative overflow-hidden rounded-lg bg-gray-800">
                          <img 
                            src={preview} 
                            alt={file.name}
                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      )}
                      
                      {/* Progress Indicator */}
                      {uploadInProgress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Uploading...</span>
                            <span className="text-blue-400">Processing</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1">
                            <motion.div 
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Success State */}
                      {uploadSuccess && (
                        <motion.div 
                          className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg px-3 py-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Ready to post</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 mt-8"
            >
              <motion.div 
                className="flex items-center justify-center gap-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-5 h-5 text-cyan-400" />
                <p className="text-lg font-semibold text-white">Your content is ready!</p>
              </motion.div>
              <p className="text-sm text-gray-400">
                Add a caption and share your amazing content with the world
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
