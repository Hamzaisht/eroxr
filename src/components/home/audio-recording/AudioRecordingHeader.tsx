
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';

interface AudioRecordingHeaderProps {
  isRecording: boolean;
  audioBlob: Blob | null;
  onClose: () => void;
}

export const AudioRecordingHeader = ({ 
  isRecording, 
  audioBlob, 
  onClose 
}: AudioRecordingHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-14 pt-9 pb-2 border-b border-white/10 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent rounded-t-2xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent flex items-center justify-center"
          animate={{
            scale: isRecording ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isRecording ? Infinity : 0,
          }}
        >
          <Zap className="w-5 h-5 text-white" />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white text-left">
            {audioBlob ? 'Audio Recorded' : isRecording ? 'Recording...' : 'Record Audio'}
          </h2>
          <p className="text-sm text-gray-400 text-left">
            {audioBlob ? 'Preview your recording' : isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </p>
        </div>
      </motion.div>
      
      <button
        className="group inline-flex items-center justify-center rounded-full bg-transparent hover:bg-luxury-primary/15 p-2 transition"
        onClick={onClose}
        tabIndex={0}
        type="button"
      >
        <span className="sr-only">Close</span>
        <X className="h-7 w-7 text-luxury-primary group-hover:text-luxury-secondary transition" />
      </button>
    </div>
  );
};
