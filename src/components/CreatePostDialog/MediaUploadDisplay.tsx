
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UploadHeader } from "./components/UploadHeader";
import { UploadStatusMessages } from "./components/UploadStatusMessages";
import { FilePreviewGrid } from "./components/FilePreviewGrid";
import { UploadSuccessMessage } from "./components/UploadSuccessMessage";
import { Sparkles, Upload, Zap } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-4"
    >
      {/* Premium container with studio aesthetic */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-luxury-dark/90 via-luxury-darker/95 to-luxury-dark/90 border border-luxury-primary/20 backdrop-blur-xl">
        
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/5 via-transparent to-luxury-accent/5" />
        
        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-luxury-primary/40"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>

        <div className="relative p-6 space-y-4">
          {/* Header with animations */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: uploadInProgress ? 360 : 0 }}
              transition={{ duration: uploadInProgress ? 2 : 0, repeat: uploadInProgress ? Infinity : 0, ease: "linear" }}
            >
              <Upload className="w-5 h-5 text-luxury-primary" />
            </motion.div>
            <div>
              <h4 className="text-sm font-semibold text-white">Add Media</h4>
              <p className="text-xs text-luxury-muted">Optimizing your media for best quality</p>
            </div>
          </motion.div>

          {/* Upload progress */}
          {uploadInProgress && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-luxury-accent animate-pulse" />
                  <span className="text-luxury-accent font-medium">Uploading...</span>
                </div>
                <span className="text-luxury-primary font-mono">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={uploadProgress} 
                  className="h-2 bg-luxury-darker border border-luxury-primary/20" 
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* Status messages */}
          <UploadStatusMessages
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
            uploadedAssetIds={uploadedAssetIds}
          />

          {/* File preview grid */}
          <FilePreviewGrid
            selectedFiles={selectedFiles}
            filePreviews={filePreviews}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
          />

          {/* Success message */}
          <UploadSuccessMessage uploadSuccess={uploadSuccess} />
        </div>
      </div>
    </motion.div>
  );
};
