
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UploadHeader } from "./components/UploadHeader";
import { UploadStatusMessages } from "./components/UploadStatusMessages";
import { FilePreviewGrid } from "./components/FilePreviewGrid";
import { UploadSuccessMessage } from "./components/UploadSuccessMessage";
import { Sparkles, Upload, Zap, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Simulate upload progress
  useEffect(() => {
    if (uploadInProgress) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return Math.min(prev + Math.random() * 15, 90);
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else if (uploadSuccess) {
      setUploadProgress(100);
    }
  }, [uploadInProgress, uploadSuccess]);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    console.log("📤 MediaUploadDisplay - Starting upload for", selectedFiles.length, "files");
    onUploadStart();
    setUploadProgress(10);

    try {
      const filesArray = Array.from(selectedFiles);
      const results = await uploadMultiple(filesArray, {
        category: 'posts',
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

      setUploadProgress(100);
      onUploadComplete(urls, assetIds);
      
    } catch (error) {
      console.error('💥 MediaUploadDisplay - Upload error:', error);
      setUploadProgress(0);
    }
  };

  if (!selectedFiles || selectedFiles.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      {/* Futuristic container with advanced blur and RGB borders */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-3xl">
        
        {/* Animated RGB border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/60 via-purple-500/60 via-pink-500/60 to-yellow-400/60 blur-sm animate-[spin_6s_linear_infinite]"></div>
        <div className="absolute inset-[1px] rounded-2xl bg-black/60 backdrop-blur-3xl"></div>
        
        {/* Neural network background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        {/* Floating quantum particles */}
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${['#00f5ff', '#8b5cf6', '#f472b6', '#facc15'][i % 4]}, transparent)`,
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.4, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>

        <div className="relative z-10 p-8 space-y-6">
          {/* Header with holographic effect */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                rotate: uploadInProgress ? 360 : 0,
                scale: uploadInProgress ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                rotate: { duration: uploadInProgress ? 2 : 0, repeat: uploadInProgress ? Infinity : 0, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative"
            >
              <Upload className="w-6 h-6 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-pulse" />
            </motion.div>
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quantum Media Processing
              </h4>
              <p className="text-sm text-white/50">Optimizing your cosmic creations</p>
            </div>
          </motion.div>

          {/* Enhanced upload progress */}
          {uploadInProgress && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                  <span className="text-yellow-400 font-semibold">Neural Network Processing...</span>
                </div>
                <span className="text-cyan-400 font-mono text-lg">{Math.round(uploadProgress)}%</span>
              </div>
              
              <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Quantum processing indicators */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>Analyzing</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>Enhancing</span>
                </div>
                <div className="flex items-center gap-2 text-pink-400">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  <span>Uploading</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Status messages with enhanced styling */}
          <UploadStatusMessages
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
            uploadedAssetIds={uploadedAssetIds}
          />

          {/* Enhanced file preview grid */}
          <FilePreviewGrid
            selectedFiles={selectedFiles}
            filePreviews={filePreviews}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
          />

          {/* Success message with celebration effect */}
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-400/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
              </motion.div>
              <div>
                <p className="text-green-400 font-semibold">Quantum Upload Complete!</p>
                <p className="text-green-300/60 text-sm">Your cosmic creation is ready to launch</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
