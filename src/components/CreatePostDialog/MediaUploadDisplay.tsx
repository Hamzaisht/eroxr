
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
  const { uploadMultiple } = useMediaUpload();

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <Label className="text-lg font-semibold text-white">
                Media Upload in Progress
              </Label>
              <p className="text-sm text-gray-400">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Premium Upload</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 p-4"
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
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-900/20 to-emerald-800/20 border border-green-500/30 p-4"
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
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-800/20 border border-blue-500/30 p-4"
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

      {/* File Previews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from(selectedFiles).map((file, index) => {
          const previewKey = `${file.name}-${index}`;
          const preview = filePreviews[previewKey];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 p-4 hover:border-gray-600/50 transition-all duration-300"
            >
              {/* Ambient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative space-y-3">
                {/* File Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600">
                      {getFileIcon(file)}
                    </div>
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
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
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
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                )}
                
                {/* Success State */}
                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg px-3 py-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Ready to post</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Call to Action */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <p className="text-lg font-semibold text-white">Your content is ready!</p>
          </div>
          <p className="text-sm text-gray-400">
            Add a caption and share your amazing content with the world
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
