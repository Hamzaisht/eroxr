
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UploadHeader } from "./components/UploadHeader";
import { UploadStatusMessages } from "./components/UploadStatusMessages";
import { FilePreviewGrid } from "./components/FilePreviewGrid";
import { UploadSuccessMessage } from "./components/UploadSuccessMessage";
import { FloatingParticles } from "./components/FloatingParticles";

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
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.02,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.02,
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
          
          <FloatingParticles />

          <UploadHeader fileCount={selectedFiles.length} />

          <UploadStatusMessages
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
            uploadedAssetIds={uploadedAssetIds}
          />

          <FilePreviewGrid
            selectedFiles={selectedFiles}
            filePreviews={filePreviews}
            uploadSuccess={uploadSuccess}
            uploadInProgress={uploadInProgress}
          />

          <UploadSuccessMessage uploadSuccess={uploadSuccess} />
        </div>
      </motion.div>
    </div>
  );
};
