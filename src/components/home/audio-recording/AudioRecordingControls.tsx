
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface AudioRecordingControlsProps {
  isRecording: boolean;
  recordingDuration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayPause: () => void;
}

export const AudioRecordingControls = ({
  isRecording,
  recordingDuration,
  audioBlob,
  audioUrl,
  isPlaying,
  audioRef,
  onStartRecording,
  onStopRecording,
  onPlayPause
}: AudioRecordingControlsProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Duration Display */}
      <motion.div 
        className="text-4xl font-mono text-luxury-primary bg-luxury-primary/10 px-6 py-3 rounded-2xl border border-luxury-primary/20"
        animate={{
          boxShadow: isRecording 
            ? ["0 0 20px rgba(147, 51, 234, 0.3)", "0 0 40px rgba(147, 51, 234, 0.6)", "0 0 20px rgba(147, 51, 234, 0.3)"]
            : "0 0 20px rgba(147, 51, 234, 0.3)",
        }}
        transition={{
          duration: 2,
          repeat: isRecording ? Infinity : 0,
        }}
      >
        {formatTime(recordingDuration)}
      </motion.div>

      {/* Main Action Button */}
      {!audioBlob ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`relative h-28 w-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isRecording 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-luxury-primary to-luxury-accent hover:scale-105'
          }`}
          style={{
            boxShadow: isRecording 
              ? '0 0 40px rgba(239, 68, 68, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
              : '0 0 40px rgba(147, 51, 234, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
          }}
        >
          {isRecording ? (
            <>
              <Square className="h-10 w-10 text-white" />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full border-4 border-red-300/50"
              />
            </>
          ) : (
            <Mic className="h-10 w-10 text-white" />
          )}
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 w-full"
        >
          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} className="hidden" />
          )}
          
          {/* Playback Controls */}
          <div className="flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onPlayPause}
              className="h-20 w-20 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300"
              style={{
                boxShadow: '0 0 30px rgba(147, 51, 234, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
              }}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </motion.button>
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20"
          >
            <p className="text-sm text-green-400 font-medium">
              🎉 Perfect! Your audio is ready to share
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
