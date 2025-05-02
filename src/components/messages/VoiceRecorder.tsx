
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  isRecording: boolean;
  duration: number;
  onStop: () => void;
  onCancel: () => void;
}

export const VoiceRecorder = ({ 
  isRecording, 
  duration, 
  onStop, 
  onCancel 
}: VoiceRecorderProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-luxury-neutral/5 rounded-lg border border-luxury-primary/20">
      <div className="flex items-center gap-2 flex-1">
        <motion.div
          animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
          transition={{ 
            repeat: isRecording ? Infinity : 0, 
            duration: 1.5 
          }}
          className="relative"
        >
          <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Mic className="h-5 w-5 text-red-500" />
          </div>
          {isRecording && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full bg-red-500/30"
            />
          )}
        </motion.div>
        
        <div className="text-sm">
          <div className="font-medium flex items-center gap-2">
            Recording
            {isRecording && (
              <span className="flex h-2 w-2">
                <motion.span 
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </div>
          <div className="text-luxury-neutral/70">{formatTime(duration)}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-luxury-neutral/10" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full", 
            isRecording ? "bg-luxury-primary text-white hover:bg-luxury-primary/90" : "bg-luxury-neutral/20"
          )}
          onClick={onStop}
          disabled={!isRecording}
        >
          <Send className="h-4 w-4 ml-0.5" />
        </Button>
      </div>
    </div>
  );
};
