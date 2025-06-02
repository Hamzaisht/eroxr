
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

interface UploadStatusMessagesProps {
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadInProgress: boolean;
  uploadedAssetIds: string[];
}

export const UploadStatusMessages = ({
  uploadError,
  uploadSuccess,
  uploadInProgress,
  uploadedAssetIds
}: UploadStatusMessagesProps) => {
  return (
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
  );
};
