
import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";

interface MediaPreviewProps {
  currentUrl?: string;
  preview: string | null;
  fileType: 'image' | 'video' | null;
  type: 'avatar' | 'banner';
}

export const MediaPreview = ({ currentUrl, preview, fileType, type }: MediaPreviewProps) => {
  const displayUrl = preview || currentUrl;
  
  if (!displayUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-200">
          {preview ? 'Divine Preview' : 'Current Divine Media'}
        </h3>
        <Sparkles className="w-4 h-4 text-cyan-400" />
      </div>
      
      <div className={`relative overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-sm ${
        type === 'avatar' ? 'w-48 h-48 mx-auto rounded-full' : 'w-full h-64'
      }`}>
        {fileType === 'video' || (displayUrl.includes('.mp4') || displayUrl.includes('.webm')) ? (
          <video
            src={displayUrl}
            className="w-full h-full object-cover"
            controls={false}
            muted
            loop
            autoPlay
          />
        ) : (
          <img
            src={displayUrl}
            alt={`${type} preview`}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Divine overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      </div>
    </motion.div>
  );
};
