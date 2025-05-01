
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send } from 'lucide-react';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSend,
  onCancel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Start recording when component mounts
  useEffect(() => {
    startRecording();
    
    // Clean up on unmount
    return () => {
      stopRecording();
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
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="flex items-center space-x-2 p-2 bg-luxury-primary/10 rounded-lg">
      {isRecording ? (
        <>
          <div className="flex items-center gap-2 flex-1">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">{formatTime(recordingTime)}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 text-sm">
            {audioBlob ? 'Recording complete' : 'Recording stopped'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={onCancel}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-luxury-primary/20"
            onClick={handleSend}
            disabled={!audioBlob}
          >
            <Send className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
