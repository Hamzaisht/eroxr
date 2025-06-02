
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Zap, Upload } from 'lucide-react';
import { AccessLevelSelector } from '../AccessLevelSelector';
import { MediaAccessLevel } from '@/utils/media/types';

interface UploadFormProps {
  selectedFiles: File[];
  accessLevel: MediaAccessLevel;
  setAccessLevel: (level: MediaAccessLevel) => void;
  ppvAmount: number;
  setPpvAmount: (amount: number) => void;
  altText: string;
  setAltText: (text: string) => void;
  isUploading: boolean;
  progress: number;
  error: string | null;
  showAccessSelector: boolean;
  showPPV: boolean;
  onUpload: () => void;
}

export const UploadForm = ({
  selectedFiles,
  accessLevel,
  setAccessLevel,
  ppvAmount,
  setPpvAmount,
  altText,
  setAltText,
  isUploading,
  progress,
  error,
  showAccessSelector,
  showPPV,
  onUpload
}: UploadFormProps) => {
  return (
    <div className="space-y-4">
      {showAccessSelector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AccessLevelSelector
            value={accessLevel}
            onChange={setAccessLevel}
            showPPV={showPPV}
          />
        </motion.div>
      )}

      {accessLevel === MediaAccessLevel.PPV && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Price (USD)
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={ppvAmount}
            onChange={(e) => setPpvAmount(Number(e.target.value))}
            min="0"
            step="0.01"
            className="bg-gray-800/50 border-gray-600/50 text-white"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Alt Text (Optional)
        </label>
        <Input
          placeholder="Describe this content for accessibility"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="bg-gray-800/50 border-gray-600/50 text-white"
        />
      </motion.div>
      
      {isUploading && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-cyan-400 text-center">
            Uploading... {progress}%
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div 
          className="text-sm text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={onUpload}
          disabled={isUploading || selectedFiles.length === 0}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-0"
        >
          {isUploading ? (
            <motion.div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-4 h-4" />
              </motion.div>
              Uploading... {progress}%
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Upload {selectedFiles.length} file(s)
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};
