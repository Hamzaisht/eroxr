import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface VoiceRecorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendVoice: (audioUrl: string) => void;
}

export const VoiceRecorderDialog = ({ open, onOpenChange, onSendVoice }: VoiceRecorderDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check microphone permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setDuration(0);
  };

  const sendRecording = async () => {
    if (!recordedBlob || !session?.user?.id) return;

    setUploading(true);
    try {
      const fileName = `${session.user.id}/${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('messages')
        .upload(fileName, recordedBlob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      onSendVoice(publicUrl);
      onOpenChange(false);
      setRecordedBlob(null);
      setDuration(0);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md holographic-card border-white/20 p-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        </div>

        <div className="relative z-10">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Voice Message</span>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 text-center">
            {!recordedBlob ? (
              <div className="space-y-6">
                <motion.div
                  className="relative w-24 h-24 mx-auto"
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                >
                  <div className={`absolute inset-0 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                      : 'bg-gradient-to-r from-primary to-purple-500'
                  } flex items-center justify-center`}>
                    {isRecording ? (
                      <MicOff className="w-10 h-10 text-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </div>
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                  )}
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    {isRecording ? 'Recording...' : 'Tap to record'}
                  </h3>
                  <p className="text-white/60">
                    {isRecording ? formatDuration(duration) : 'Hold and speak'}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white border-0 shadow-lg shadow-primary/30 px-8 py-3 rounded-xl"
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/30 px-8 py-3 rounded-xl"
                    >
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Recording Complete</h3>
                  <p className="text-white/60">Duration: {formatDuration(duration)}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={discardRecording}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                  </Button>
                  <Button
                    onClick={sendRecording}
                    disabled={uploading}
                    className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white border-0 shadow-lg shadow-primary/30 px-6 py-2 rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {uploading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};