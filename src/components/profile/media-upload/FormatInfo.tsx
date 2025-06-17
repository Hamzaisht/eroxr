
import { motion } from "framer-motion";
import { ImageIcon, Video, Crown } from "lucide-react";

interface FormatInfoProps {
  type: 'avatar' | 'banner';
}

export const FormatInfo = ({ type }: FormatInfoProps) => {
  const isAvatar = type === 'avatar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-200">Divine Format Requirements</h3>
      </div>
      
      <div className={`grid gap-4 ${isAvatar ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <ImageIcon className="w-6 h-6 text-cyan-400" />
          <div>
            <div className="font-semibold text-slate-200">Sacred Images</div>
            <div className="text-sm text-slate-400">JPG, PNG, WebP, GIF</div>
            <div className="text-xs text-slate-500">Max: {isAvatar ? '10MB' : '50MB'}</div>
          </div>
        </div>
        
        {!isAvatar && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <Video className="w-6 h-6 text-purple-400" />
            <div>
              <div className="font-semibold text-slate-200">Divine Videos</div>
              <div className="text-sm text-slate-400">MP4, WebM, MOV</div>
              <div className="text-xs text-slate-500">Max: 50MB</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center p-4 rounded-xl bg-gradient-to-r from-slate-800/30 to-gray-800/30 border border-slate-600/20">
        <p className="text-sm text-slate-400">
          {isAvatar 
            ? 'Recommended: 400x400px square format for optimal divine presentation'
            : 'Recommended: 1500x500px for maximum divine impact across all realms'
          }
        </p>
      </div>
    </motion.div>
  );
};
