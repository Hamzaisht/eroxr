
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useCameraRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera and microphone access to record stories.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const startRecording = useCallback(async () => {
    const stream = streamRef.current || await requestPermissions();
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording failed',
        description: 'Failed to start recording. Please try again.',
        variant: 'destructive',
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    resetRecording();
    setHasPermission(false);
  }, [resetRecording]);

  return {
    isRecording,
    recordedBlob,
    recordingTime,
    hasPermission,
    startRecording,
    stopRecording,
    resetRecording,
    cleanup,
    requestPermissions,
  };
};
