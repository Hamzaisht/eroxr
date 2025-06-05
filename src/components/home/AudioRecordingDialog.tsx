
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioRecording } from '@/hooks/useAudioRecording';

interface AudioRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAudioRecorded: (audioBlob: Blob) => void;
}

export const AudioRecordingDialog = ({ 
  open, 
  onOpenChange, 
  onAudioRecorded 
}: AudioRecordingDialogProps) => {
  const {
    isRecording,
    recordingDuration,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecording({ maxDuration: 300 });

  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob);
      onOpenChange(false);
      cancelRecording();
    }
  };

  const handleCancel = () => {
    cancelRecording();
    onOpenChange(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-[#181B24] via-[#161B22] to-[#0D1117] border border-white/10 rounded-2xl overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-luxury-primary/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="relative p-8 space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="flex items-center gap-3">
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
            </div>
          </motion.div>

          {/* Recording Controls */}
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
                onClick={isRecording ? stopRecording : startRecording}
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
                    onClick={handlePlayPause}
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
                  onClick={handleCancel}
                  className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-white/5 hover:border-gray-500 rounded-xl h-12"
                >
                  Record Again
                </Button>
                
                <Button
                  onClick={handleSend}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
