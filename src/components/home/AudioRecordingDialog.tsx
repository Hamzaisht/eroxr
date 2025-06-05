
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, X, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
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
  } = useAudioRecording({ maxDuration: 300 }); // 5 minutes max

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
      <DialogContent className="max-w-md mx-auto bg-luxury-darker border-luxury-neutral/20">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              {audioBlob ? 'Audio Recorded' : isRecording ? 'Recording...' : 'Record Audio'}
            </h2>
            <p className="text-gray-400 text-sm">
              {audioBlob ? 'Preview your recording' : isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {/* Recording Duration */}
            <div className="text-2xl font-mono text-luxury-primary">
              {formatTime(recordingDuration)}
            </div>

            {/* Recording Button or Playback */}
            {!audioBlob ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-luxury-primary hover:bg-luxury-primary/80'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 rounded-full border-4 border-red-300/50"
                    />
                  </>
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </motion.button>
            ) : (
              <div className="space-y-4 w-full">
                {audioUrl && (
                  <audio ref={audioRef} src={audioUrl} className="hidden" />
                )}
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-12 w-12 rounded-full bg-luxury-primary/10 border-luxury-primary/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-luxury-primary" />
                    ) : (
                      <Play className="h-5 w-5 text-luxury-primary" />
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-400">
                  Click play to preview your recording
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-white/5"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            {audioBlob && (
              <Button
                onClick={handleSend}
                className="flex-1 bg-luxury-primary hover:bg-luxury-primary/80 text-white"
              >
                Use Recording
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
