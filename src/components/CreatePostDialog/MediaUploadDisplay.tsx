
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UploadHeader } from "./components/UploadHeader";
import { UploadStatusMessages } from "./components/UploadStatusMessages";
import { FilePreviewGrid } from "./components/FilePreviewGrid";
import { UploadSuccessMessage } from "./components/UploadSuccessMessage";

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
        category: 'posts', // Use 'category' instead of 'contentCategory'
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4"
    >
      {/* Compact gradient border */}
      <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        
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
  );
};
