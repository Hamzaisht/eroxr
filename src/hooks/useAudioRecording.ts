
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAudioRecordingReturn {
  isRecording: boolean;
  recordingDuration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  error: string | null;
}

export function useAudioRecording(options = { maxDuration: 60 }): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          console.error('Error stopping media recorder:', err);
        }
      }
      mediaRecorderRef.current = null;
    }
    
    setIsRecording(false);
  }, []);
  
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      setAudioUrl(null);
      chunksRef.current = [];
      
      console.log('Requesting microphone access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }
      
      // Request microphone permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Microphone access granted, starting recording...');
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          
          setAudioBlob(blob);
          setAudioUrl(url);
        }
        
        cleanup();
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          
          if (newDuration >= options.maxDuration) {
            stopRecording();
            return options.maxDuration;
          }
          
          return newDuration;
        });
      }, 1000);
      
    } catch (err: any) {
      console.error('Error starting recording:', err);
      
      let errorMessage = 'Failed to start recording';
      let toastDescription = 'Please check your microphone permissions and try again';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied';
        toastDescription = 'Please allow microphone access in your browser settings and refresh the page';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found';
        toastDescription = 'Please connect a microphone and try again';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Recording not supported';
        toastDescription = 'Your browser does not support audio recording';
      }
      
      setError(errorMessage);
      
      toast({
        title: errorMessage,
        description: toastDescription,
        variant: "destructive"
      });
      
      cleanup();
    }
  }, [cleanup, options.maxDuration, toast]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const cancelRecording = useCallback(() => {
    cleanup();
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [cleanup, audioUrl]);
  
  return {
    isRecording,
    recordingDuration,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    error
  };
}
