
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { AudioRecordingHeader } from './audio-recording/AudioRecordingHeader';
import { AudioRecordingControls } from './audio-recording/AudioRecordingControls';
import { AudioRecordingActions } from './audio-recording/AudioRecordingActions';
import { FloatingParticles } from './audio-recording/FloatingParticles';

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
        <FloatingParticles />

        <div className="relative p-8 space-y-8">
          <AudioRecordingHeader 
            isRecording={isRecording}
            audioBlob={audioBlob}
            onClose={handleCancel}
          />

          <AudioRecordingControls
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            audioBlob={audioBlob}
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            audioRef={audioRef}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPlayPause={handlePlayPause}
          />

          <AudioRecordingActions
            audioBlob={audioBlob}
            isRecording={isRecording}
            onCancel={handleCancel}
            onSend={handleSend}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
