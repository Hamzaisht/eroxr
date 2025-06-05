
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AudioRecordingActionsProps {
  audioBlob: Blob | null;
  isRecording: boolean;
  onCancel: () => void;
  onSend: () => void;
}

export const AudioRecordingActions = ({
  audioBlob,
  isRecording,
  onCancel,
  onSend
}: AudioRecordingActionsProps) => {
  return (
    <>
      {/* Action Buttons */}
      <AnimatePresence>
        {audioBlob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex space-x-3"
          >
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-white/5 hover:border-gray-500 rounded-xl h-12"
            >
              Record Again
            </Button>
            
            <Button
              onClick={onSend}
              className="flex-1 bg-gradient-to-r from-luxury-primary to-luxury-accent text-white hover:scale-105 transition-all duration-300 rounded-xl h-12 shadow-lg"
              style={{
                boxShadow: '0 8px 25px rgba(147, 51, 234, 0.3)'
              }}
            >
              Use Recording
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Tip */}
      {!isRecording && !audioBlob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500 bg-white/5 rounded-lg p-3 border border-white/10"
        >
          💡 Tip: Speak clearly and avoid background noise for best quality
        </motion.div>
      )}
    </>
  );
};
